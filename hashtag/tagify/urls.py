from django.conf.urls import url

from .views import (
                    AnalyzeImage,
                    GetWhoopeeData,
                    UserCreate,
                    GetUserWiseData
                    )

urlpatterns = [
    url(r'^analyzeImage/$', AnalyzeImage.as_view()),
    url(r'^getWhoopeeData/(?P<pk>(\d+))/$', GetWhoopeeData.as_view()),
    url(r'^userCreate/$', UserCreate.as_view()),
    url(r'^getUserData/(?P<pk>(\d+))/$', GetUserWiseData.as_view()),
]