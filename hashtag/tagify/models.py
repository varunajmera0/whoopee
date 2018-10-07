from django.db import models
from django.contrib.postgres.fields import ArrayField


# Create your models here.

class Author(models.Model):
    name = models.CharField(max_length=50, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'author'

    def __str__(self):
        return str(self.name)


class Category(models.Model):
    name = models.CharField(max_length=100, null=True, blank=True)
    keywords = ArrayField(models.CharField(max_length=100), null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'category'
        verbose_name = 'category'
        verbose_name_plural = 'categories'

    def __str__(self):
        return str(self.name)


class Caption(models.Model):
    category = models.ForeignKey(Category, related_name='cat_caption', on_delete=models.CASCADE)
    text_caption = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'caption'

    def __str__(self):
        return str(self.text_caption)


class Quote(models.Model):
    category = models.ForeignKey(Category, related_name='cat_quote', on_delete=models.CASCADE)
    author = models.ForeignKey(Author, related_name='author_quote', on_delete=models.CASCADE, null=True, blank=True)
    text_quote = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'quote'

    def __str__(self):
        return str(self.text_quote)


class Hashtag(models.Model):
    category = models.ForeignKey(Category, related_name='cat_hashtag', on_delete=models.CASCADE)
    text_hashtag = ArrayField(models.CharField(max_length=200))
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'hashtag'

    def __str__(self):
        return str(self.text_hashtag)