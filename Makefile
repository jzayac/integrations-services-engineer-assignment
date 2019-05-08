default: build

compile-go:
	go build -buildmode=c-shared -o src/golang/golib.so src/golang/golib.go

compile-go-with-docker:
	docker build -t exptest/golang .
	docker run -it --rm -v ${PWD}/src/golang:/go/src/golang exptest/golang go build -buildmode=c-shared -o src/golang/golib.so src/golang/golib.go

build: compile-go
	npm run build
