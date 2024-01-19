all: build push

build:
	podman build -f Containerfile.v1.0 -t quay.io/jerolimov/demo:1.0 .
	podman build -f Containerfile.v1.1 -t quay.io/jerolimov/demo:1.1 .
	podman build -f Containerfile.v1.2 -t quay.io/jerolimov/demo:1.2 -t quay.io/jerolimov/demo:1 .
	podman build -f Containerfile.v2.0 -t quay.io/jerolimov/demo:2.0 .
	podman build -f Containerfile.v2.1 -t quay.io/jerolimov/demo:2.1 .
	podman build -f Containerfile.v2.2 -t quay.io/jerolimov/demo:2.2 -t quay.io/jerolimov/demo:2 -t quay.io/jerolimov/demo:latest .

push:
	podman push quay.io/jerolimov/demo:1.0
	podman push quay.io/jerolimov/demo:1.1
	podman push quay.io/jerolimov/demo:1.2
	podman push quay.io/jerolimov/demo:1
	podman push quay.io/jerolimov/demo:2.0
	podman push quay.io/jerolimov/demo:2.1
	podman push quay.io/jerolimov/demo:2.2
	podman push quay.io/jerolimov/demo:2
	podman push quay.io/jerolimov/demo:latest
