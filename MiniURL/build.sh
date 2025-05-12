#!/usr/bin/env bash
set -euxo pipefail

# Install Nix
sh <(curl -L https://nixos.org/nix/install) --no-daemon

# Source Nix
. ~/.nix-profile/etc/profile.d/nix.sh

# Build with flakes
nix build .#default --impure

# Copy binary to root
cp ./tmp/miniurl .
