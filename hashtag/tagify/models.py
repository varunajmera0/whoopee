from datetime import time, date

from django.db import models
from django.contrib.postgres.fields import ArrayField
import os
from uuid import uuid4


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


class User(models.Model):
    first_name = models.CharField(max_length=50, null=True, blank=True)
    last_name = models.CharField(max_length=50, null=True, blank=True)
    email = models.EmailField(max_length=254, null=True, blank=True)
    user_id = models.CharField(max_length=100, null=True, blank=True)
    token = models.CharField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'users'

    def __str__(self):
        return self.first_name + " " + self.last_name


def path_and_rename(instance, filename):
    today_path = date.today().strftime("%Y/%m")
    upload_to = "whoopee/" + today_path + "/"
    ext = filename.split('.')[-1]
    # get filename
    if instance.pk:
        filename = '{}.{}'.format(instance.pk, ext)
    else:
        # set filename as random string
        filename = '{}.{}'.format(uuid4().hex, ext)
    # return the whole path to the file
    return os.path.join(upload_to, filename)


class Analytic(models.Model):
    user = models.ForeignKey(User, related_name='user_analytics', on_delete=models.CASCADE)
    data = models.TextField(null=True, blank=True)
    image = models.ImageField(upload_to=path_and_rename, max_length=100)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'analytics'

    def __str__(self):
        return str(self.user)


