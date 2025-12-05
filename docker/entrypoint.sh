#!/bin/sh
set -e

echo "🔧 Generating environment variables from Docker Swarm secrets..."

# Function to read a secret if it exists
read_secret() {
  local secret_name="$1"
  if [ -f "/run/secrets/$secret_name" ]; then
    cat "/run/secrets/$secret_name"
  else
    echo ""
  fi
}

# Generate env file
cat <<EOF > .env.production
NEXT_PUBLIC_API_URL="$(read_secret giftizy_next_public_api_url)"
APP_NAME="$(read_secret giftizy_app_name)"

BETTER_AUTH_SECRET="$(read_secret giftizy_better_auth_secret)"
BETTER_AUTH_URL="$(read_secret giftizy_better_auth_url)"

DATABASE_URL="$(read_secret giftizy_database_url)"

ADMIN_EMAILS="$(read_secret giftizy_admin_emails)"

GOOGLE_CLIENT_ID="$(read_secret giftizy_google_client_id)"
GOOGLE_CLIENT_SECRET="$(read_secret giftizy_google_client_secret)"

NODEMAILER_USER="$(read_secret giftizy_nodemailer_user)"
NODEMAILER_APP_PASSWORD="$(read_secret giftizy_nodemailer_app_password)"
EOF

echo "✅ .env.production generated successfully"

echo "🚀 Starting application..."
exec "$@"
