#!/bin/sh
set -e

echo "🔧 Loading environment variables from Docker Swarm secrets..."

# Function to read a secret if it exists
read_secret() {
  local secret_name="$1"
  if [ -f "/run/secrets/$secret_name" ]; then
    cat "/run/secrets/$secret_name"
  else
    echo ""
  fi
}

# Export environment variables directly
export NEXT_PUBLIC_API_URL="$(read_secret giftizy_next_public_api_url)"
export APP_NAME="$(read_secret giftizy_app_name)"
export BETTER_AUTH_SECRET="$(read_secret giftizy_better_auth_secret)"
export BETTER_AUTH_URL="$(read_secret giftizy_better_auth_url)"
export DATABASE_URL="$(read_secret giftizy_database_url)"
export ADMIN_EMAILS="$(read_secret giftizy_admin_emails)"
export GOOGLE_CLIENT_ID="$(read_secret giftizy_google_client_id)"
export GOOGLE_CLIENT_SECRET="$(read_secret giftizy_google_client_secret)"
export NODEMAILER_USER="$(read_secret giftizy_nodemailer_user)"
export NODEMAILER_APP_PASSWORD="$(read_secret giftizy_nodemailer_app_password)"

echo "✅ Environment variables loaded successfully"

echo "🚀 Starting application..."
exec "$@"
# Force rebuild
