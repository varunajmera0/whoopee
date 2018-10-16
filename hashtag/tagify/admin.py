from django.contrib import admin
from .models import Category, Author, Caption, Quote, Hashtag, User, Analytic

# Register your models here.
admin.site.register(Category)
admin.site.register(Author)
admin.site.register(Caption)
admin.site.register(Quote)
admin.site.register(Hashtag)
admin.site.register(User)
admin.site.register(Analytic)