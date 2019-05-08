default: build

compile-go:
	go build -buildmode=c-shared -o golib.so src/golang/golib.go

build: compile-go
	npm run build
