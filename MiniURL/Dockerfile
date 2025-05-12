# syntax = docker/dockerfile:1.3
FROM nixos/nix AS builder

WORKDIR /app
COPY . .

RUN --mount=type=cache,target=/nix/store \
    nix build .#default && \
    cp result/bin/miniurl /app/miniurl

FROM alpine:latest
WORKDIR /root/
COPY --from=builder /app/miniurl .
EXPOSE 8080
CMD ["./miniurl"]
