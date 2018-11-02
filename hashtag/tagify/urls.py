from django.conf.urls import url

from .views import (
                    AnalyzeImage,
                    GetWhoopeeData,
                    UserCreate
                    )

urlpatterns = [
    url(r'^analyzeImage/$', AnalyzeImage.as_view()),
    url(r'^getWhoopeeData/(?P<pk>(\d+))/$', GetWhoopeeData.as_view()),
    url(r'^userCreate/$', UserCreate.as_view()),
]