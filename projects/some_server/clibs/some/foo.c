#include "stdio.h"
#include "foo.h"
#include "libsome/libsome_api.h"

void printint(int v) {
    printf("printint: %d\n", v);
}

int deltaToJsonString(const char* str) {
  libsome_ExportedSymbols* lib = libsome_symbols();
 libsome_kref_parchment_DeltaSerializer deltaSerializer = lib -> kotlin.root.parchment.DeltaSerializer.DeltaSerializer();
  libsome_kref_parchment_Node node = lib -> kotlin.root.parchment
      .DeltaSerializer.parseToNode(deltaSerializer, str);
  libsome_kref_parchment_NodeSerializer newInstance = lib -> kotlin.root.parchment.NodeSerializer.NodeSerializer();
  const char* response = lib -> kotlin.root.parchment.NodeSerializer.
      encodeToJsonString(newInstance, node);
  printf("%s\n", response);
  lib->DisposeString(response);
  return 0;
}