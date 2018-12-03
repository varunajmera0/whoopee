from datetime import datetime

from rest_framework import serializers

from .models import Category, Author, Quote, Hashtag, Analytic, User


class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ('name',)


class QuoteSerializer(serializers.ModelSerializer):
    author = AuthorSerializer()
    class Meta:
        model = Quote
        fields = ('text_quote', 'author')


class HashtagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hashtag
        fields = ('text_hashtag',)


class CategorySerializer(serializers.ModelSerializer):
    cat_hashtag = HashtagSerializer(many=True)
    cat_quote = QuoteSerializer(many=True)

    class Meta:
        model = Category
        fields = ('name', 'cat_quote', 'cat_hashtag')


class AnalyticSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    created_at = serializers.SerializerMethodField()

    class Meta:
        model = Analytic
        fields = '__all__'

    def get_image(self, obj):
        return obj.image.name

    def get_created_at(self, obj):
        return datetime.strptime(str(obj.updated_at), "%Y-%m-%d %H:%M:%S.%f+00:00").strftime("%d-%m-%Y")


class UserSerializer(serializers.ModelSerializer):
    user_analytics = AnalyticSerializer(many=True)

    class Meta:
        model = User
        fields = '__all__'
