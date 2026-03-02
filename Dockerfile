# This is a Dockerfile for the Django web application. It sets up a 
# Python environment, installs dependencies, and runs the app.


FROM python:3.12-slim

# Set working directory inside container.
WORKDIR /app

# Copy everything (project files, app packages, templates, etc.).
COPY . .
RUN pip install --no-cache-dir -r requirements.txt

# Run migrations to set up app database schema.
RUN python3 manage.py makemigrations
RUN python3 manage.py migrate

# Django runs on port 8000 by default.
EXPOSE 8000

# runserver listens on all interfaces so the port can be mapped
# to the host. Without the binding the development server only
# accepts connections from inside the container (127.0.0.1).
CMD ["python3", "manage.py", "runserver", "0.0.0.0:8000"]