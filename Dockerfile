FROM python AS base
RUN pip install -U pip setuptools wheel

FROM base AS deps
WORKDIR /opt/coincoin
COPY requirements.txt requirements.txt
RUN pip install -Ur requirements.txt

FROM deps AS src
COPY manage.py manage.py
COPY proj proj
COPY coincoin coincoin

FROM src AS static
RUN SECRET_KEY="no-secret" python manage.py collectstatic --no-input

FROM static as serve
COPY entrypoint.sh entrypoint.sh
EXPOSE 8000
ENTRYPOINT ["/opt/coincoin/entrypoint.sh"]
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "proj.wsgi"]
