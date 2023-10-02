from django import forms
from apps.ads.models import Country


class CountryAdminForm(forms.ModelForm):
    image_input = forms.ImageField(required=False)

    class Meta:
        model = Country
        fields = [
            "image_input",
            "name",
            "image_url",
        ]
