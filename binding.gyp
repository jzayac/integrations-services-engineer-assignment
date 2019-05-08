{
  "targets": [
    {
      "target_name": "addon",
      "sources": [ "src/golib.cc" ],
      "libraries": [ "<!(pwd)/src/golang/golib.so" ]
    }
  ]
}
