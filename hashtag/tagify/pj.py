from django.shortcuts import render
from django.conf import settings
from django.http import JsonResponse
from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth import get_user_model  # getUserModel
from django.views import View
from django.http import HttpResponse
from rest_framework import status
from rest_framework.response import Response
from rest_framework import generics, views, permissions
import matplotlib.pyplot as plt
from PIL import Image
from io import BytesIO
import requests
from brainyquote import pybrainyquote
import base64


from datamuse import datamuse
from bs4 import BeautifulSoup
import os

import collections
from collections import defaultdict

from .models import Caption, Category, Author, Quote, Hashtag, Analytic
from .serializers import QuoteSerializer, CategorySerializer, AnalyticSerializer
from django.core.files.base import ContentFile
import json

class AzureAI:
    def __init__(self):
        self.subscription_key = "b7e0e2904d294689af31d6dcca745cee"
        self.vision_base_url = "https://southeastasia.api.cognitive.microsoft.com/vision/v2.0/"
        self.params = {'visualFeatures': 'Categories,Tags,Description,Faces', 'details': 'Celebrities,Landmarks'}

    def objectdetection(self, url):
        analyze_url = self.vision_base_url + "analyze"

        # Set image_path to the local path of an image that you want to analyze.
        # image_url = url
        image_path = url
        image_url = url

        # Read the image into a byte array
        # image_url = open(image_path, "rb").read()
        # Read the image into a byte array
        image_data = open(image_path, "rb").read()
        print('----url')
        print(url)
        # print(image_data)print
        print('----fininshed')
        # headers = {'Ocp-Apim-Subscription-Key': self.subscription_key, }
        headers = {'Ocp-Apim-Subscription-Key': self.subscription_key,
                   'Content-Type': 'application/octet-stream'}
        # data = {'url': image_url}
        response = None
        response1= None
        AzureRequest = requests.post(analyze_url, headers=headers, params=self.params, data=image_data)
        # try:
        #     pass
        #     # response1 = requests.post(analyze_url, headers=headers, params=self.params, json=data)
        #     # response1.raise_for_status()
        #     # print(response1.reason)
        #     # print('response.raise_for_status()')
        #     # print(response1.raise_for_status())
        #     # analysis = response1.json()
        #     # response = analysis
        #     # print(analysis)
        # except requests.exceptions.HTTPError as errh:
        #     print ("Http Error:", errh)
        #     print(dir(errh))
        #     print(errh.raise_for_status())
        #     print(errh.args)
        # except requests.exceptions.ConnectionError as errc:
        #     print ("Error Connecting:", errc)
        # except requests.exceptions.Timeout as errt:
        #     print ("Timeout Error:", errt)
        # except requests.exceptions.RequestException as err:
        #     print ("OOps: Something Else", err)
        # response = {'categories': [{'name': 'people_group', 'score': 0.58203125,
        #                             'detail': {'celebrities': [], "landmarks": [
        #                                 {
        #                                     "name": "Forbidden City",
        #                                     "confidence": 0.9978346
        #                                 }
        #                             ]}}], 'tags': [{
        #     "name": "person",
        #     "confidence": 0.98979085683822632
        # },
        #     {
        #         "name": "man",
        #         "confidence": 0.94493889808654785
        #     },
        #     {
        #         "name": "outdoor",
        #         "confidence": 0.938492476940155
        #     },
        #     {
        #         "name": "window",
        #         "confidence": 0.89513939619064331
        #     }], 'description': {'tags': ['posing', 'dress', 'woman', 'young'], 'captions': [{'text': 'a person posing for a picture', 'confidence': 0.894517205714279}]}, 'faces': [{'age': 35, 'gender': 'Male', 'faceRectangle': {'top': 99, 'left': 119, 'width': 44, 'height': 44}}, {'age': 45, 'gender': 'Female', 'faceRectangle': {'top': 29, 'left': 193, 'width': 39, 'height': 39}}], 'color': {'dominantColorForeground': 'White', 'dominantColorBackground': 'White', 'dominantColors': ['White'], 'accentColor': '452424', 'isBwImg': False}, 'requestId': 'a0fa70e4-31d6-4087-8e1c-a1bf9022b00e', 'metadata': {'height': 300, 'width': 400, 'format': 'Jpeg'}}
        print('response1.reason',AzureRequest.reason)
        print('response1.reason',AzureRequest.text)
        print('response1.reason',json.loads(AzureRequest.text).get("statusCode"))
        if json.loads(AzureRequest.text).get("statusCode") != 200:
            return {"key": "error", "data": json.loads(AzureRequest.text).get("message")}
        response = AzureRequest.json()
        data = {}
        if response is not None:
            if "categories" in response:
                data['categories'] = response.get("categories")[0]["name"]
                if "detail" in response.get('categories')[0]:
                    if "celebrities" in response.get("categories")[0]["detail"]:
                        data['celebrities'] = list(x['name'] for x in response.get("categories")[0]["detail"]["celebrities"])
                    if "landmarks" in response.get("categories")[0]["detail"]:
                        data['landmarks'] = list(x['name'] for x in response.get("categories")[0]["detail"]["landmarks"])
            if "tags" in response:
                data['tags'] = list(x['name'] for x in response.get("tags"))

            if "tags" in data:
                if len(data.get("tags")) > 0:
                    data['other_tags'] = response.get("description")["tags"]
                else:
                    data['tags'] = response.get("description")["tags"]
            else:
                data['tags'] = response.get("description")["tags"]

            if "captions" in response.get("description"):
                if len(response.get("description")['captions']) > 0:
                    data['captions'] = response.get("description")["captions"][0]["text"]

            if "faces" in response:
                data['faces'] = list({x['gender']: x['age']} for x in response.get("faces"))
            return {"key": "success", "data": data}

def nested_dict(n, type):
    if n == 1:
        return defaultdict(type)
    else:
        return defaultdict(lambda: nested_dict(n-1, type))

class Getfuck(views.APIView):
    def post(self, request, format=None):
        print ('request')
        # print (request.data)
        print('--files1')
        # print(request.FILES['photo1'])
        # # print (request.FILES['photo1'].read())
        # print (request.FILES['photo1'].content_type)
        print(ContentFile(request.data.get('photo')))
        files = {}
        # print(request.data['photo'])
        image_data = request.data.get('photo')
        print ('base64')
        # print (image_data)
        # format, imgstr = image_data.split(';base64,')
        # format, imgstr = request.data.get('photo').split(';base64,')
        # ext = format.split('/')[-1]
        try:
            files['image'] = ContentFile(base64.b64decode(request.data.get('photo')))
        except KeyError:
            return Response('Request has no resource file attached')
        files['image'].name = request.data.get('photo_name')
        files['user_id'] = 1
        # print(file)
        # print(file.size)
        # print(file.content_type)
        # print(file.tell)
        # print(dir(file))
        # ant = Analytic.objects.create(image=file, data='asdsa', user_id=1)
        ant = Analytic.objects.create(**files)
        vp = Analytic.objects.get(id=ant.id)
        print('-----vp ---')
        # print(settings.BASE_DIR)
        # print(vp.image.url)
        # print(settings.BASE_DIR+vp.image.url)
        azu = AzureAI()
        # print(azu.objectdetection())
        print('-----')
        d = azu.objectdetection(settings.BASE_DIR+vp.image.url)
        print(d)
        print(d.get('key'))
        print(d.get('key') == "error")
        if d.get('key') == "error":
            # return Response({'error': d.get('data')}, status=status.HTTP_400_BAD_REQUEST)
            return Response({'error': d.get('data')}, status=status.HTTP_200_OK)
        Analytic.objects.filter(id=ant.id).update(data=d)
        print('taggingus')
        # print(d.get('tags'))
        print('tags name')

        mainify = WhoopeeMainify
        for f in d.get('tags'):
            mainify.whoopee(f)
        #
        #     print(f)
        print('-----vp --- id hai')
        print (ant)
        print(ant.id)
        return Response({'id': ant.id}, status=status.HTTP_200_OK)

    def get(self, request, format=None, pk=None):

        """
        Return a list of all users.
        """
        p = Analytic.objects.get(id=pk)
        print (p.data)
        print (eval(p.data).get('tags'))

        data = collections.defaultdict(lambda: collections.defaultdict(list))
        # data = {}

        pt = Quote.objects.filter(category__name='person')
        for pi in pt:
            data["quotes"][str(pi.category.name)].append({'q': json.dumps(pi)})
            print('-----------quote-------')
            print(pi)
            print('-----------cat-------')
            # print(pi.category.id)
            # print(pi.category.name)
            # print('-----------autghor-------')
            # print(pi.author.id)
            # print(pi.author.name)
        print('pt')
        print(pt)

        return Response(data)

import json

class Getp(generics.ListAPIView):
    permission_classes = [permissions.AllowAny]
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_queryset(self, p):
        return Category.objects.get(name=p)

    def list(self, request, pk=None):
        # Note the use of `get_queryset()` instead of `self.queryset`
        po = Analytic.objects.filter(id=pk).first()
        print('as')
        print(po)
        # print (eval(po.data))
        # # print(dict(po))
        # # pl = po.__dict__.get('data')
        # # print(pl)
        # print(po.data.get('tags'))
        # print(po.data['tags'])
        data = {}
        for pul in eval(po.data).get('tags'):
            print('as------')
            print(pul)
            queryset = self.get_queryset(pul)
            serializer = CategorySerializer(queryset)
            data[pul] = serializer.data
        data['ana'] = AnalyticSerializer(po).data
        return Response(data, status=status.HTTP_200_OK)


class getTag(View):
    def get(self, request, *args, **kwargs):
        # If you are using a Jupyter notebook, uncomment the following line.
        # %matplotlib inline


        # Replace <Subscription Key> with your valid subscription key.
        # subscription_key = "b7e0e2904d294689af31d6dcca745cee"
        # assert subscription_key

        # You must use the same region in your REST call as you used to get your
        # subscription keys. For example, if you got your subscription keys from
        # westus, replace "westcentralus" in the URI below with "westus".
        #
        # Free trial subscription keys are generated in the westcentralus region.
        # If you use a free trial subscription key, you shouldn't need to change
        # this region.
        # vision_base_url = "https://southeastasia.api.cognitive.microsoft.com/vision/v2.0/"

        # analyze_url = self.vision_base_url + "analyze"

        # Set image_path to the local path of an image that you want to analyze.
        image_url = "https://timesofindia.indiatimes.com/thumb/msid-62548765,width-400,resizemode-4/62548765.jpg"

        # Read the image into a byte array
        # image_data = open(image_path, "rb").read()
        # headers = {'Ocp-Apim-Subscription-Key': self.subscription_key, }

        data = {'url': image_url}
        # try:
        #     response = requests.post(analyze_url, headers=headers, params=params, json=data)
        #     print('response.raise_for_status()')
        #     print(response.raise_for_status())
        #     analysis = response.json()
        #     print(analysis)
        # except Exception as e:
        #     print (e)
        #     print(e.args)
        response = {'categories': [{'name': 'people_group', 'score': 0.58203125,
                                    'detail': {'celebrities': [], "landmarks": [
                                        {
                                            "name": "Forbidden City",
                                            "confidence": 0.9978346
                                        }
                                    ]}}], 'tags': [{
            "name": "person",
            "confidence": 0.98979085683822632
        },
            {
                "name": "man",
                "confidence": 0.94493889808654785
            },
            {
                "name": "outdoor",
                "confidence": 0.938492476940155
            },
            {
                "name": "window",
                "confidence": 0.89513939619064331
            }], 'description': {'tags': ['posing', 'dress', 'woman', 'young'], 'captions': [{'text': 'a person posing for a picture', 'confidence': 0.894517205714279}]}, 'faces': [{'age': 35, 'gender': 'Male', 'faceRectangle': {'top': 99, 'left': 119, 'width': 44, 'height': 44}}, {'age': 45, 'gender': 'Female', 'faceRectangle': {'top': 29, 'left': 193, 'width': 39, 'height': 39}}], 'color': {'dominantColorForeground': 'White', 'dominantColorBackground': 'White', 'dominantColors': ['White'], 'accentColor': '452424', 'isBwImg': False}, 'requestId': 'a0fa70e4-31d6-4087-8e1c-a1bf9022b00e', 'metadata': {'height': 300, 'width': 400, 'format': 'Jpeg'}}
        data = {}
        if "categories" in response:
            data['categories'] = response.get("categories")[0]["name"]
            if "detail" in response.get('categories')[0]:
                if "celebrities" in response.get("categories")[0]["detail"]:
                    data['celebrities'] = list(x['name'] for x in response.get("categories")[0]["detail"]["celebrities"])
                if "landmarks" in response.get("categories")[0]["detail"]:
                    data['landmarks'] = list(x['name'] for x in response.get("categories")[0]["detail"]["landmarks"])
        if "tags" in response:
            data['tags'] = list(x['name'] for x in response.get("tags"))

        if "tags" in data:
            if len(data.get("tags")) > 0:
                data['other_tags'] = response.get("description")["tags"]
            else:
                data['tags'] = response.get("description")["tags"]
        else:
            data['tags'] = response.get("description")["tags"]

        if "captions" in response.get("description"):
            if len(response.get("description")['captions']) > 0:
                data['captions'] = response.get("description")["captions"][0]["text"]

        if "faces" in response:
            data['faces'] = list({x['gender']: x['age']} for x in response.get("faces"))

        print ('response')
        # api = datamuse.Datamuse()
        # pi = api.words(ml='wedding', max=100)
        # pi = list(x['word'] for x in pi)
        print('------------------')
        print(data.get('tags'))
        print('------------------')
        tg = 'marriage'
        # search = Category.objects.filter(keywords__contains=[tg])
        # if search.exists():
        #     print('jikp')
        #     print(search)
        #     pass
        # else:
        #     Category.objects.create(name=tg, keywords=pi)
        # wh_cat = WhoopeeCategory()
        # cat = wh_cat.whoopee_cat('ticket')
        # t = HashTag1
        # pi = t.whoopee_hashtag('ticket').get('data')
        # pi = list(x['tag'] for x in pi)
        # po = Hashtag.objects.filter(category_id=cat)
        # print('catyyy')
        # print (cat)
        # if not po.exists():
        #     Hashtag.objects.create(category_id=cat, text_hashtag=pi)
        print (data)

        print('------------------')
        # print (pi)
        print('------------------')
        print('brainy qoutes')
        # print(pybrainyquote.get_quotes('inspirational', 5000))
        # g = grab
        # print (g.get_quotes('ticket'))
        h = Hashtag.objects.filter()
        return HttpResponse("Hello World")
        # The 'analysis' object contains various fields that describe the image. The most
        # relevant caption for the image is obtained from the 'description' property.


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
            bn = BrainyQuotes
            print('bn.grab_quotes(f)')
            print ('not exist')
            print(tag)
            az = AZQuotes
            tg = Tagify
            # print(f)
            print('az')
            az.grab_quotes(cat.get('cat_id'), tag)
            print('bn')
            bn.grab_quotes(cat.get('cat_id'), tag)
            print('hashtag')
            tg.grab_hashtag(cat.get('cat_id'), tag)
        else:
            print('---------======================')
            print('exist already')
            print(tag)
            print('---------======================')



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
            # print('tagify')
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
            # quotes = []
            for quote in soup.find_all('a', {'class': ['title']}):
                if not quote.img:
                    wh_author = WhoopeeAuthor
                    aut = wh_author.whoopee_author(quote.get('data-author'))
                    az = Quote.objects.filter(text_quote=quote.contents[0])
                    if not az.exists():
                        Quote.objects.create(category_id=catId, author_id=aut, text_quote=quote.contents[0])


class BrainyQuotes1:
    def grab_quotes(self, type):
        url = "http://www.brainyquote.com/quotes/topics/topic_" + type + ".html"
        # url = "https://www.azquotes.com/quotes/topics/sassy.html?p=1"
        response = requests.get(url)
        soup = BeautifulSoup(response.text, "html.parser")
        quotes = []
        print('spoup')
        # print(soup)
        for quote in soup.find_all('a', {'title': ['view quote', 'view author']}):
            # for quote in soup.find_all('a', {'class': ['title']}):
            print ('quotes')
            # print (quote.get('data-author'))
            if quote.img:
                print(quote.img)
            else:
                print (quote.contents)
            print('--=-=-=-=-=-=-=--=-=---=')
            # print(quote.contents[0])
            quotes.append(quote.contents[0])
        print('hibs')
        print(quotes)
        return quotes

class grab(View):

    def get_quotes(type, number_of_quotes=1):
        # url = "http://www.brainyquote.com/quotes/topics/topic_" + type + ".html"
        url = "https://www.azquotes.com/quotes/topics/" + type + ".html?p=1"
        response = requests.get(url)
        soup = BeautifulSoup(response.text, "html.parser")
        quotes = []
        print('spoup')
        # print(soup)
        # for quote in soup.find_all('a', {'title': ['view quote', 'view author']}):
        wh_cat = WhoopeeCategory()
        cat = wh_cat.whoopee_cat(type)
        for quote in soup.find_all('a', {'class': ['title']}):
            print ('quotes')
            # print (quote.get('data-author'))

            if not quote.img:
                wh_author = WhoopeeAuthor
                aut = wh_author.whoopee_author(quote.get('data-author'))
                q = Quote.objects.filter(text_quote=quote.contents[0])
                if not q.exists():
                    qid = Quote.objects.create(category_id=cat, author_id=aut, text_quote=quote.contents[0])
            print('--=-=-=-=-=-=-=--=-=---=')
            # print(quote.contents[0])
            quotes.append(quote.contents[0])
        print('hibs')
        print(quotes)
        return quotes