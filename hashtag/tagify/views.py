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


from datamuse import datamuse
from bs4 import BeautifulSoup

from .models import Caption, Category, Author, Quote, Hashtag
from .serializers import QuoteSerializer


# Create your views here.
class ExpertAvailableSlotListCreateGeneric(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        pass

class AzureAI:
    def __init__(self):
        self.subscription_key = "b7e0e2904d294689af31d6dcca745cee"
        self.vision_base_url = "https://southeastasia.api.cognitive.microsoft.com/vision/v2.0/"
        self.params = {'visualFeatures': 'Categories,Tags,Description,Faces', 'details': 'Celebrities,Landmarks'}

    def objectdetection(self):
        analyze_url = self.vision_base_url + "analyze"

        # Set image_path to the local path of an image that you want to analyze.
        image_url = "https://timesofindia.indiatimes.com/thumb/msid-62548765,width-400,resizemode-4/62548765.jpg"

        # Read the image into a byte array
        # image_data = open(image_path, "rb").read()
        headers = {'Ocp-Apim-Subscription-Key': self.subscription_key, }

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
        api = datamuse.Datamuse()
        pi = api.words(ml='wedding', max=50)
        pi = list(x['word'] for x in pi)
        print('------------------')
        print(pi)
        print('------------------')
        tg = 'marriage'
        search = Category.objects.filter(keywords__contains=[tg])
        if search.exists():
            print('jikp')
            print(search)
            pass
        else:
            Category.objects.create(name=tg, keywords=pi)
        print (data)
        print (pi)
        print('brainy qoutes')
        # print(pybrainyquote.get_quotes('inspirational', 5000))
        g = grab
        print (g.get_quotes('inspirational'))
        return HttpResponse("Hello World")
        pass




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
        api = datamuse.Datamuse()
        pi = api.words(ml='wedding', max=50)
        pi = list(x['word'] for x in pi)
        print('------------------')
        print(pi)
        print('------------------')
        tg = 'marriage'
        search = Category.objects.filter(keywords__contains=[tg])
        if search.exists():
            print('jikp')
            print(search)
            pass
        else:
            Category.objects.create(name=tg, keywords=pi)
        print (data)
        print (pi)
        print('brainy qoutes')
        # print(pybrainyquote.get_quotes('inspirational', 5000))
        g = grab
        print (g.get_quotes('friendship'))
        return HttpResponse("Hello World")
        # The 'analysis' object contains various fields that describe the image. The most
        # relevant caption for the image is obtained from the 'description' property.



class BrainyQuotes:
    def grab_quotes(self, type):
        pass
class grab(View):

    def get_quotes(type, number_of_quotes=1):
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
        # random.shuffle(quotes)
        print('hibs')
        print(quotes)
        result = quotes[:number_of_quotes]
        return result