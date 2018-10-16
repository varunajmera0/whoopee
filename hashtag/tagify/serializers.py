from rest_framework import serializers

from .models import Category, Author, Quote, Hashtag, Analytic


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
    class Meta:
        model = Analytic
        fields = '__all__'
