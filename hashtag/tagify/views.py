from django.conf import settings
from django.core.files.base import ContentFile

from rest_framework import status
from rest_framework.response import Response
from rest_framework import generics, views, permissions

import requests
import base64
import json

from datamuse import datamuse
from bs4 import BeautifulSoup

from .models import Category, Author, Quote, Hashtag, Analytic, User
from .serializers import CategorySerializer, AnalyticSerializer, UserSerializer


class UserCreate(views.APIView):
    def post(self, request, format=None):
        user = User.objects.filter(email=request.data.get('email'))
        if not user.exists():
            userCreated = User.objects.create(first_name=request.data.get('first_name'), last_name=request.data.get('last_name'), email=request.data.get('email'), user_id=request.data.get('id'), token=request.data.get('access_token'))
            return Response({'userId': userCreated.id}, status=status.HTTP_200_OK)
        else:
            user.update(user_id=request.data.get('id'), token=request.data.get('access_token'))
        return Response({'userId': user.first().id}, status=status.HTTP_200_OK)


class AzureAI:
    def __init__(self):
        self.subscription_key = "aad19fc3869c47b192392b69c78aedd6"  # from whoope01
        # self.subscription_key = "b7e0e2904d294689af31d6dcca745cee" # from varunajmera07
        # self.vision_base_url = "https://southeastasia.api.cognitive.microsoft.com/vision/v2.0/" # from varunajmera07
        self.vision_base_url = "https://centralindia.api.cognitive.microsoft.com/vision/v2.0/"  # from whoope01
        self.params = {'visualFeatures': 'Categories,Tags,Description,Faces', 'details': 'Celebrities,Landmarks'}

    def objectdetection(self, image_path):
        analyze_url = self.vision_base_url + "analyze"

        # Read the image into a byte array
        image_data = open(image_path, "rb").read()
        headers = {'Ocp-Apim-Subscription-Key': self.subscription_key,
                   'Content-Type': 'application/octet-stream'}
        AzureRequest = requests.post(analyze_url, headers=headers, params=self.params, data=image_data)

        if AzureRequest.status_code != 200:
            return {"key": "error", "data": json.loads(AzureRequest.text).get("message")}

        response = None
        response = AzureRequest.json()

        data = {}
        if response is not None:
            if "categories" in response:
                data["categories"] = response.get("categories")[0]["name"]
                if "detail" in response.get('categories')[0]:
                    if "celebrities" in response.get("categories")[0]["detail"]:
                        data["celebrities"] = list(x["name"] for x in response.get("categories")[0]["detail"]["celebrities"])
                    if "landmarks" in response.get("categories")[0]["detail"]:
                        data["landmarks"] = list(x["name"] for x in response.get("categories")[0]["detail"]["landmarks"])
            if "tags" in response:
                data["tags"] = list(x["name"] for x in response.get("tags"))

            if "tags" in data:
                if len(data.get("tags")) > 0:
                    data["other_tags"] = response.get("description")["tags"]
                else:
                    data["tags"] = response.get("description")["tags"]
            else:
                data["tags"] = response.get("description")["tags"]

            if "captions" in response.get("description"):
                if len(response.get("description")['captions']) > 0:
                    data["captions"] = response.get("description")["captions"][0]["text"]

            if "faces" in response:
                data["faces"] = list({x["gender"]: x["age"]} for x in response.get("faces"))
            return {"key": "success", "data": data}


class AnalyzeImage(views.APIView):
    def post(self, request, format=None):
        files = {}
        try:
            files['image'] = ContentFile(base64.b64decode(request.data.get('photo')))
        except KeyError:
            return Response({"error": "Request has no resource file attached."}, status=status.HTTP_400_BAD_REQUEST)

        files['image'].name = request.data.get('photo_name')
        files['user_id'] = request.data.get('user_id')

        queryAnalytic = Analytic.objects.create(**files)
        get_QueryAnalytic = Analytic.objects.get(id=queryAnalytic.id)

        azure = AzureAI()
        azureResponse = azure.objectdetection(settings.BASE_DIR + get_QueryAnalytic.image.url)

        if azureResponse.get('key') == "error":
            return Response({"error": azureResponse.get('data')}, status=status.HTTP_400_BAD_REQUEST)

        Analytic.objects.filter(id=queryAnalytic.id).update(data=json.dumps(azureResponse.get("data")))

        mainify = WhoopeeMainify
        for tag in azureResponse.get('data')["tags"]:
            mainify.whoopee(tag)

        return Response({"id": queryAnalytic.id}, status=status.HTTP_200_OK)


class GetWhoopeeData(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_queryset(self, key):
        return Category.objects.filter(name=key)

    def list(self, request, pk=None):
        # Note the use of `get_queryset()` instead of `self.queryset`
        whoopeedata = {}
        queryAnalytic = Analytic.objects.filter(id=pk)
        if queryAnalytic.exists():
            if queryAnalytic.first().data != None:
                for key in eval(queryAnalytic.first().data).get('tags'):
                    queryset = self.get_queryset(key)
                    if queryset.exists():
                        serializer = CategorySerializer(queryset.first())
                        whoopeedata[key] = serializer.data
                whoopeedata['analysis'] = AnalyticSerializer(queryAnalytic.first()).data
                return Response(whoopeedata, status=status.HTTP_200_OK)
            return Response({"error": "Analysis data doesn't exist."}, status=status.HTTP_400_BAD_REQUEST)
        return Response({"error": "Record doesn't exist."}, status=status.HTTP_400_BAD_REQUEST)


class GetUserWiseData(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_queryset(self, pk):
        return User.objects.get(id=pk)

    def list(self, request, pk=None):
        # Note the use of `get_queryset()` instead of `self.queryset`
        userExist = User.objects.filter(id=pk)
        if userExist.exists():
            queryset = self.get_queryset(pk)
            serializer = UserSerializer(queryset)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response({"error": "User doesn't exist."}, status=status.HTTP_400_BAD_REQUEST)


class WhoopeeCategory:
    def __init__(self):
        self.synonym = datamuse.Datamuse()

    def whoopee_cat(self, cat_name):
        exist_cat = Category.objects.filter(name=cat_name)
        row_exist = False
        if exist_cat.exists():
            cat = exist_cat.first()
            row_exist = True
        else:
            keywords = self.synonym.words(ml=cat_name, max=50)
            keys = list(keyword['word'] for keyword in keywords)
            cat = Category.objects.create(name=cat_name, keywords=keys)
            row_exist = False
        return {'cat_id': cat.id, 'row_exist': row_exist}


class WhoopeeMainify:
    def whoopee(tag):
        wh_cat = WhoopeeCategory()
        cat = wh_cat.whoopee_cat(tag)
        if not cat.get('row_exist'):
            bnQuotes = BrainyQuotes
            azQuotes = AZQuotes
            tgify = Tagify

            azQuotes.grab_quotes(cat.get('cat_id'), tag)
            bnQuotes.grab_quotes(cat.get('cat_id'), tag)
            tgify.grab_hashtag(cat.get('cat_id'), tag)


class WhoopeeAuthor:
    def whoopee_author(author):
        exist_author = Author.objects.filter(name=author)
        if exist_author.exists():
            auth = exist_author.first()
        else:
            auth = Author.objects.create(name=author)
        return auth.id


class BrainyQuotes:
    def grab_quotes(catId, tag):
        url = "https://www.brainyquote.com/topics/" + tag
        response = requests.get(url)
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, "html.parser")
            qid = None
            for quote in soup.find_all('a', {'title': ['view author', 'view quote']}):
                if not quote.img:
                    if quote.get('title') == 'view quote':
                        q = Quote.objects.filter(text_quote=quote.contents[0])
                        if not q.exists():
                            qid = Quote.objects.create(text_quote=quote.contents[0], category_id=catId)
                    elif quote.get('title') == 'view author':
                        wh_author = WhoopeeAuthor
                        aut = wh_author.whoopee_author(quote.contents[0])
                        if not q.exists():
                            Quote.objects.filter(id=qid.id).update(author_id=aut)
                        else:
                            Quote.objects.filter(id=q.first().id).update(author_id=aut)


class Tagify:
    def grab_hashtag(catId, tag):
        url = "https://tagify.io/api/v3/recommendations?type=tag&q=" + tag + "&count=100"
        response = requests.get(url)
        if response.status_code == 200:
            tags = response.json().get('data')
            tag_list = list(x['tag'] for x in tags)
            cat_exist = Hashtag.objects.filter(category_id=catId)
            if not cat_exist.exists():
                Hashtag.objects.create(category_id=catId, text_hashtag=tag_list)


class AZQuotes:
    def grab_quotes(catId, tag):
        url = "https://www.azquotes.com/quotes/topics/" + tag + ".html?p=1"
        response = requests.get(url)
        if response.status_code == 200:
            soup = BeautifulSoup(response.text, "html.parser")
            for quote in soup.find_all('a', {'class': ['title']}):
                if not quote.img:
                    wh_author = WhoopeeAuthor
                    aut = wh_author.whoopee_author(quote.get('data-author'))
                    az = Quote.objects.filter(text_quote=quote.contents[0])
                    if not az.exists():
                        Quote.objects.create(category_id=catId, author_id=aut, text_quote=quote.contents[0])
