#include <node.h>
#include "./golang/golib.h"

namespace golib {

using v8::Exception;
using v8::NewStringType;
using v8::FunctionCallbackInfo;
using v8::Isolate;
using v8::Number;
using v8::Local;
using v8::Object;
using v8::String;
using v8::Value;

const char* ToCString(const String::Utf8Value& value) {
  return *value ? *value : "<string conversion failed>";
}

void LengthMethod(const FunctionCallbackInfo<Value>& args) {
  int result = GetLength();
  args.GetReturnValue().Set(result);
}

void FlushMethod(const FunctionCallbackInfo<Value>& args) {
  Flush();
}

void ToJsonMethod(const FunctionCallbackInfo<Value>& args) {
  Isolate* isolate = args.GetIsolate();
  char* result = ToJson();
  args.GetReturnValue().Set(String::NewFromUtf8(isolate, result));
}

void PushMethod(const FunctionCallbackInfo<Value>& args) {
  // Isolate* isolate = args.GetIsolate();

  String::Utf8Value str(args[0]);
  const char* cstremail = ToCString(str);
  char * charstremail = const_cast<char *>(cstremail);

  String::Utf8Value src(args[1]);
  const char* cstraction = ToCString(src);
  char * charstraction = const_cast<char *>(cstraction);

  int orderId = args[2].As<Number>()->Value();
  int item = args[3].As<Number>()->Value();
  int price = args[4].As<Number>()->Value();

  Push(charstremail, charstraction, orderId, item, price);
}

void init(Local<Object> exports) {
  NODE_SET_METHOD(exports, "push", PushMethod);
  NODE_SET_METHOD(exports, "length", LengthMethod);
  NODE_SET_METHOD(exports, "toJson", ToJsonMethod);
  NODE_SET_METHOD(exports, "flush", FlushMethod);
}

NODE_MODULE(NODE_GYP_MODULE_NAME, init)

}  // namespace golib
