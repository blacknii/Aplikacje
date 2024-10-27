# Use the official PostgreSQL image as a base
FROM postgres:13

# Set environment variables for the database
ENV POSTGRES_USER=user
ENV POSTGRES_PASSWORD=password
ENV POSTGRES_DB=mydatabase

# Copy any initialization SQL scripts
COPY ./init.sql /docker-entrypoint-initdb.d/

# Expose the default PostgreSQL port
EXPOSE 5432
