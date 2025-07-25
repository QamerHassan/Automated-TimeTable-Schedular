from django import forms

class TimetableGenerationForm(forms.Form):
    max_semester = forms.IntegerField(
        min_value=1,
        max_value=8,
        initial=4,
        label='Maximum Semester',
        help_text='Enter the maximum semester number (1-8)'
    )
    file = forms.FileField(
        label='Course Data File',
        help_text='Upload an Excel file (.xlsx or .xls) containing course data',
        widget=forms.FileInput(attrs={'accept': '.xlsx,.xls'})
    )
