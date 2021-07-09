#ifndef KONAN_LIBSOME_H
#define KONAN_LIBSOME_H
#ifdef __cplusplus
extern "C" {
#endif
#ifdef __cplusplus
typedef bool            libsome_KBoolean;
#else
typedef _Bool           libsome_KBoolean;
#endif
typedef unsigned short     libsome_KChar;
typedef signed char        libsome_KByte;
typedef short              libsome_KShort;
typedef int                libsome_KInt;
typedef long long          libsome_KLong;
typedef unsigned char      libsome_KUByte;
typedef unsigned short     libsome_KUShort;
typedef unsigned int       libsome_KUInt;
typedef unsigned long long libsome_KULong;
typedef float              libsome_KFloat;
typedef double             libsome_KDouble;
typedef float __attribute__ ((__vector_size__ (16))) libsome_KVector128;
typedef void*              libsome_KNativePtr;
struct libsome_KType;
typedef struct libsome_KType libsome_KType;

typedef struct {
  libsome_KNativePtr pinned;
} libsome_kref_kotlin_Byte;
typedef struct {
  libsome_KNativePtr pinned;
} libsome_kref_kotlin_Short;
typedef struct {
  libsome_KNativePtr pinned;
} libsome_kref_kotlin_Int;
typedef struct {
  libsome_KNativePtr pinned;
} libsome_kref_kotlin_Long;
typedef struct {
  libsome_KNativePtr pinned;
} libsome_kref_kotlin_Float;
typedef struct {
  libsome_KNativePtr pinned;
} libsome_kref_kotlin_Double;
typedef struct {
  libsome_KNativePtr pinned;
} libsome_kref_kotlin_Char;
typedef struct {
  libsome_KNativePtr pinned;
} libsome_kref_kotlin_Boolean;
typedef struct {
  libsome_KNativePtr pinned;
} libsome_kref_kotlin_Unit;
typedef struct {
  libsome_KNativePtr pinned;
} libsome_kref_delta_Delta;
typedef struct {
  libsome_KNativePtr pinned;
} libsome_kref_kotlin_Array;
typedef struct {
  libsome_KNativePtr pinned;
} libsome_kref_kotlinx_serialization_internal_SerializationConstructorMarker;
typedef struct {
  libsome_KNativePtr pinned;
} libsome_kref_kotlin_Any;
typedef struct {
  libsome_KNativePtr pinned;
} libsome_kref_delta_Delta_$serializer;
typedef struct {
  libsome_KNativePtr pinned;
} libsome_kref_kotlinx_serialization_descriptors_SerialDescriptor;
typedef struct {
  libsome_KNativePtr pinned;
} libsome_kref_kotlinx_serialization_encoding_Decoder;
typedef struct {
  libsome_KNativePtr pinned;
} libsome_kref_kotlinx_serialization_encoding_Encoder;
typedef struct {
  libsome_KNativePtr pinned;
} libsome_kref_delta_Delta_Companion;
typedef struct {
  libsome_KNativePtr pinned;
} libsome_kref_kotlinx_serialization_KSerializer;
typedef struct {
  libsome_KNativePtr pinned;
} libsome_kref_delta_InsertAttributes;
typedef struct {
  libsome_KNativePtr pinned;
} libsome_kref_delta_InsertAttributes_$serializer;
typedef struct {
  libsome_KNativePtr pinned;
} libsome_kref_delta_InsertAttributes_Companion;
typedef struct {
  libsome_KNativePtr pinned;
} libsome_kref_delta_ObjectValue;
typedef struct {
  libsome_KNativePtr pinned;
} libsome_kref_delta_ObjectValue_$serializer;
typedef struct {
  libsome_KNativePtr pinned;
} libsome_kref_delta_ObjectValue_Companion;
typedef struct {
  libsome_KNativePtr pinned;
} libsome_kref_delta_Op;
typedef struct {
  libsome_KNativePtr pinned;
} libsome_kref_delta_Op_Companion;
typedef struct {
  libsome_KNativePtr pinned;
} libsome_kref_delta_OpObject;
typedef struct {
  libsome_KNativePtr pinned;
} libsome_kref_delta_OpObject_$serializer;
typedef struct {
  libsome_KNativePtr pinned;
} libsome_kref_delta_OpObject_Companion;
typedef struct {
  libsome_KNativePtr pinned;
} libsome_kref_delta_OpString;
typedef struct {
  libsome_KNativePtr pinned;
} libsome_kref_delta_OpString_$serializer;
typedef struct {
  libsome_KNativePtr pinned;
} libsome_kref_delta_OpString_Companion;
typedef struct {
  libsome_KNativePtr pinned;
} libsome_kref_parchment_ColumnNode;
typedef struct {
  libsome_KNativePtr pinned;
} libsome_kref_parchment_DeltaSerializer;
typedef struct {
  libsome_KNativePtr pinned;
} libsome_kref_parchment_Node;
typedef struct {
  libsome_KNativePtr pinned;
} libsome_kref_parchment_HeaderNode;
typedef struct {
  libsome_KNativePtr pinned;
} libsome_kref_parchment_LinkNode;
typedef struct {
  libsome_KNativePtr pinned;
} libsome_kref_kotlin_collections_ArrayList;
typedef struct {
  libsome_KNativePtr pinned;
} libsome_kref_parchment_NodeSerializer;
typedef struct {
  libsome_KNativePtr pinned;
} libsome_kref_parchment_TextNode;
typedef struct {
  libsome_KNativePtr pinned;
} libsome_kref_utils_StringUtils;


typedef struct {
  /* Service functions. */
  void (*DisposeStablePointer)(libsome_KNativePtr ptr);
  void (*DisposeString)(const char* string);
  libsome_KBoolean (*IsInstance)(libsome_KNativePtr ref, const libsome_KType* type);
  libsome_kref_kotlin_Byte (*createNullableByte)(libsome_KByte);
  libsome_kref_kotlin_Short (*createNullableShort)(libsome_KShort);
  libsome_kref_kotlin_Int (*createNullableInt)(libsome_KInt);
  libsome_kref_kotlin_Long (*createNullableLong)(libsome_KLong);
  libsome_kref_kotlin_Float (*createNullableFloat)(libsome_KFloat);
  libsome_kref_kotlin_Double (*createNullableDouble)(libsome_KDouble);
  libsome_kref_kotlin_Char (*createNullableChar)(libsome_KChar);
  libsome_kref_kotlin_Boolean (*createNullableBoolean)(libsome_KBoolean);
  libsome_kref_kotlin_Unit (*createNullableUnit)(void);

  /* User functions. */
  struct {
    struct {
      struct {
        struct {
          libsome_KType* (*_type)(void);
          libsome_kref_delta_Delta (*Delta)(libsome_KInt seen1, libsome_kref_kotlin_Array ops, libsome_kref_kotlinx_serialization_internal_SerializationConstructorMarker serializationConstructorMarker);
          libsome_kref_delta_Delta (*Delta_)(libsome_kref_kotlin_Array ops);
          libsome_kref_kotlin_Array (*get_ops)(libsome_kref_delta_Delta thiz);
          libsome_kref_kotlin_Array (*component1)(libsome_kref_delta_Delta thiz);
          libsome_kref_delta_Delta (*copy)(libsome_kref_delta_Delta thiz, libsome_kref_kotlin_Array ops);
          libsome_KBoolean (*equals)(libsome_kref_delta_Delta thiz, libsome_kref_kotlin_Any other);
          libsome_KInt (*hashCode)(libsome_kref_delta_Delta thiz);
          const char* (*toString)(libsome_kref_delta_Delta thiz);
          struct {
            libsome_KType* (*_type)(void);
            libsome_kref_delta_Delta_$serializer (*_instance)();
            libsome_kref_kotlinx_serialization_descriptors_SerialDescriptor (*get_descriptor)(libsome_kref_delta_Delta_$serializer thiz);
            libsome_kref_kotlin_Array (*childSerializers)(libsome_kref_delta_Delta_$serializer thiz);
            libsome_kref_delta_Delta (*deserialize)(libsome_kref_delta_Delta_$serializer thiz, libsome_kref_kotlinx_serialization_encoding_Decoder decoder);
            void (*serialize)(libsome_kref_delta_Delta_$serializer thiz, libsome_kref_kotlinx_serialization_encoding_Encoder encoder, libsome_kref_delta_Delta value);
          } $serializer;
          struct {
            libsome_KType* (*_type)(void);
            libsome_kref_delta_Delta_Companion (*_instance)();
            libsome_kref_kotlinx_serialization_KSerializer (*serializer)(libsome_kref_delta_Delta_Companion thiz);
          } Companion;
        } Delta;
        struct {
          libsome_KType* (*_type)(void);
          libsome_kref_delta_InsertAttributes (*InsertAttributes)(libsome_KInt seen1, const char* link, libsome_KInt header, const char* list, libsome_KBoolean codeBlock, libsome_KBoolean bold, libsome_KBoolean italic, const char* font, libsome_KBoolean strike, libsome_KBoolean underline, const char* color, const char* background, const char* align, libsome_KBoolean blockquote, libsome_kref_kotlinx_serialization_internal_SerializationConstructorMarker serializationConstructorMarker);
          libsome_kref_delta_InsertAttributes (*InsertAttributes_)(const char* link, libsome_KInt header, const char* list, libsome_KBoolean codeBlock, libsome_KBoolean bold, libsome_KBoolean italic, const char* font, libsome_KBoolean strike, libsome_KBoolean underline, const char* color, const char* background, const char* align, libsome_KBoolean blockquote);
          const char* (*get_align)(libsome_kref_delta_InsertAttributes thiz);
          const char* (*get_background)(libsome_kref_delta_InsertAttributes thiz);
          libsome_KBoolean (*get_blockquote)(libsome_kref_delta_InsertAttributes thiz);
          libsome_KBoolean (*get_bold)(libsome_kref_delta_InsertAttributes thiz);
          libsome_KBoolean (*get_codeBlock)(libsome_kref_delta_InsertAttributes thiz);
          const char* (*get_color)(libsome_kref_delta_InsertAttributes thiz);
          const char* (*get_font)(libsome_kref_delta_InsertAttributes thiz);
          libsome_KInt (*get_header)(libsome_kref_delta_InsertAttributes thiz);
          libsome_KBoolean (*get_italic)(libsome_kref_delta_InsertAttributes thiz);
          const char* (*get_link)(libsome_kref_delta_InsertAttributes thiz);
          const char* (*get_list)(libsome_kref_delta_InsertAttributes thiz);
          libsome_KBoolean (*get_strike)(libsome_kref_delta_InsertAttributes thiz);
          libsome_KBoolean (*get_underline)(libsome_kref_delta_InsertAttributes thiz);
          const char* (*component1)(libsome_kref_delta_InsertAttributes thiz);
          const char* (*component10)(libsome_kref_delta_InsertAttributes thiz);
          const char* (*component11)(libsome_kref_delta_InsertAttributes thiz);
          const char* (*component12)(libsome_kref_delta_InsertAttributes thiz);
          libsome_KBoolean (*component13)(libsome_kref_delta_InsertAttributes thiz);
          libsome_KInt (*component2)(libsome_kref_delta_InsertAttributes thiz);
          const char* (*component3)(libsome_kref_delta_InsertAttributes thiz);
          libsome_KBoolean (*component4)(libsome_kref_delta_InsertAttributes thiz);
          libsome_KBoolean (*component5)(libsome_kref_delta_InsertAttributes thiz);
          libsome_KBoolean (*component6)(libsome_kref_delta_InsertAttributes thiz);
          const char* (*component7)(libsome_kref_delta_InsertAttributes thiz);
          libsome_KBoolean (*component8)(libsome_kref_delta_InsertAttributes thiz);
          libsome_KBoolean (*component9)(libsome_kref_delta_InsertAttributes thiz);
          libsome_kref_delta_InsertAttributes (*copy)(libsome_kref_delta_InsertAttributes thiz, const char* link, libsome_KInt header, const char* list, libsome_KBoolean codeBlock, libsome_KBoolean bold, libsome_KBoolean italic, const char* font, libsome_KBoolean strike, libsome_KBoolean underline, const char* color, const char* background, const char* align, libsome_KBoolean blockquote);
          libsome_KBoolean (*equals)(libsome_kref_delta_InsertAttributes thiz, libsome_kref_kotlin_Any other);
          libsome_KInt (*hashCode)(libsome_kref_delta_InsertAttributes thiz);
          const char* (*toString)(libsome_kref_delta_InsertAttributes thiz);
          struct {
            libsome_KType* (*_type)(void);
            libsome_kref_delta_InsertAttributes_$serializer (*_instance)();
            libsome_kref_kotlinx_serialization_descriptors_SerialDescriptor (*get_descriptor)(libsome_kref_delta_InsertAttributes_$serializer thiz);
            libsome_kref_kotlin_Array (*childSerializers)(libsome_kref_delta_InsertAttributes_$serializer thiz);
            libsome_kref_delta_InsertAttributes (*deserialize)(libsome_kref_delta_InsertAttributes_$serializer thiz, libsome_kref_kotlinx_serialization_encoding_Decoder decoder);
            void (*serialize)(libsome_kref_delta_InsertAttributes_$serializer thiz, libsome_kref_kotlinx_serialization_encoding_Encoder encoder, libsome_kref_delta_InsertAttributes value);
          } $serializer;
          struct {
            libsome_KType* (*_type)(void);
            libsome_kref_delta_InsertAttributes_Companion (*_instance)();
            libsome_kref_kotlinx_serialization_KSerializer (*serializer)(libsome_kref_delta_InsertAttributes_Companion thiz);
          } Companion;
        } InsertAttributes;
        struct {
          libsome_KType* (*_type)(void);
          libsome_kref_delta_ObjectValue (*ObjectValue)(libsome_KInt seen1, const char* formula, const char* image, libsome_kref_kotlinx_serialization_internal_SerializationConstructorMarker serializationConstructorMarker);
          libsome_kref_delta_ObjectValue (*ObjectValue_)(const char* formula, const char* image);
          const char* (*get_formula)(libsome_kref_delta_ObjectValue thiz);
          const char* (*get_image)(libsome_kref_delta_ObjectValue thiz);
          const char* (*component1)(libsome_kref_delta_ObjectValue thiz);
          const char* (*component2)(libsome_kref_delta_ObjectValue thiz);
          libsome_kref_delta_ObjectValue (*copy)(libsome_kref_delta_ObjectValue thiz, const char* formula, const char* image);
          libsome_KBoolean (*equals)(libsome_kref_delta_ObjectValue thiz, libsome_kref_kotlin_Any other);
          libsome_KInt (*hashCode)(libsome_kref_delta_ObjectValue thiz);
          const char* (*toString)(libsome_kref_delta_ObjectValue thiz);
          struct {
            libsome_KType* (*_type)(void);
            libsome_kref_delta_ObjectValue_$serializer (*_instance)();
            libsome_kref_kotlinx_serialization_descriptors_SerialDescriptor (*get_descriptor)(libsome_kref_delta_ObjectValue_$serializer thiz);
            libsome_kref_kotlin_Array (*childSerializers)(libsome_kref_delta_ObjectValue_$serializer thiz);
            libsome_kref_delta_ObjectValue (*deserialize)(libsome_kref_delta_ObjectValue_$serializer thiz, libsome_kref_kotlinx_serialization_encoding_Decoder decoder);
            void (*serialize)(libsome_kref_delta_ObjectValue_$serializer thiz, libsome_kref_kotlinx_serialization_encoding_Encoder encoder, libsome_kref_delta_ObjectValue value);
          } $serializer;
          struct {
            libsome_KType* (*_type)(void);
            libsome_kref_delta_ObjectValue_Companion (*_instance)();
            libsome_kref_kotlinx_serialization_KSerializer (*serializer)(libsome_kref_delta_ObjectValue_Companion thiz);
          } Companion;
        } ObjectValue;
        struct {
          libsome_KType* (*_type)(void);
          libsome_kref_delta_Op (*Op)();
          struct {
            libsome_KType* (*_type)(void);
            libsome_kref_delta_Op_Companion (*_instance)();
            libsome_kref_kotlinx_serialization_KSerializer (*serializer)(libsome_kref_delta_Op_Companion thiz);
          } Companion;
        } Op;
        struct {
          libsome_KType* (*_type)(void);
          libsome_kref_delta_OpObject (*OpObject)(libsome_KInt seen1, libsome_kref_delta_ObjectValue insert, libsome_KInt retain, libsome_KInt delete_, libsome_kref_delta_InsertAttributes attributes, libsome_kref_kotlinx_serialization_internal_SerializationConstructorMarker serializationConstructorMarker);
          libsome_kref_delta_OpObject (*OpObject_)(libsome_kref_delta_ObjectValue insert, libsome_KInt retain, libsome_KInt delete_, libsome_kref_delta_InsertAttributes attributes);
          libsome_kref_delta_InsertAttributes (*get_attributes)(libsome_kref_delta_OpObject thiz);
          libsome_KInt (*get_delete)(libsome_kref_delta_OpObject thiz);
          libsome_kref_delta_ObjectValue (*get_insert)(libsome_kref_delta_OpObject thiz);
          libsome_KInt (*get_retain)(libsome_kref_delta_OpObject thiz);
          libsome_kref_delta_ObjectValue (*component1)(libsome_kref_delta_OpObject thiz);
          libsome_KInt (*component2)(libsome_kref_delta_OpObject thiz);
          libsome_KInt (*component3)(libsome_kref_delta_OpObject thiz);
          libsome_kref_delta_InsertAttributes (*component4)(libsome_kref_delta_OpObject thiz);
          libsome_kref_delta_OpObject (*copy)(libsome_kref_delta_OpObject thiz, libsome_kref_delta_ObjectValue insert, libsome_KInt retain, libsome_KInt delete_, libsome_kref_delta_InsertAttributes attributes);
          libsome_KBoolean (*equals)(libsome_kref_delta_OpObject thiz, libsome_kref_kotlin_Any other);
          libsome_KInt (*hashCode)(libsome_kref_delta_OpObject thiz);
          const char* (*toString)(libsome_kref_delta_OpObject thiz);
          struct {
            libsome_KType* (*_type)(void);
            libsome_kref_delta_OpObject_$serializer (*_instance)();
            libsome_kref_kotlinx_serialization_descriptors_SerialDescriptor (*get_descriptor)(libsome_kref_delta_OpObject_$serializer thiz);
            libsome_kref_kotlin_Array (*childSerializers)(libsome_kref_delta_OpObject_$serializer thiz);
            libsome_kref_delta_OpObject (*deserialize)(libsome_kref_delta_OpObject_$serializer thiz, libsome_kref_kotlinx_serialization_encoding_Decoder decoder);
            void (*serialize)(libsome_kref_delta_OpObject_$serializer thiz, libsome_kref_kotlinx_serialization_encoding_Encoder encoder, libsome_kref_delta_OpObject value);
          } $serializer;
          struct {
            libsome_KType* (*_type)(void);
            libsome_kref_delta_OpObject_Companion (*_instance)();
            libsome_kref_kotlinx_serialization_KSerializer (*serializer)(libsome_kref_delta_OpObject_Companion thiz);
          } Companion;
        } OpObject;
        struct {
          libsome_KType* (*_type)(void);
          libsome_kref_delta_OpString (*OpString)(libsome_KInt seen1, const char* insert, libsome_KInt retain, libsome_KInt delete_, libsome_kref_delta_InsertAttributes attributes, libsome_kref_kotlinx_serialization_internal_SerializationConstructorMarker serializationConstructorMarker);
          libsome_kref_delta_OpString (*OpString_)(const char* insert, libsome_KInt retain, libsome_KInt delete_, libsome_kref_delta_InsertAttributes attributes);
          libsome_kref_delta_InsertAttributes (*get_attributes)(libsome_kref_delta_OpString thiz);
          libsome_KInt (*get_delete)(libsome_kref_delta_OpString thiz);
          const char* (*get_insert)(libsome_kref_delta_OpString thiz);
          libsome_KInt (*get_retain)(libsome_kref_delta_OpString thiz);
          const char* (*component1)(libsome_kref_delta_OpString thiz);
          libsome_KInt (*component2)(libsome_kref_delta_OpString thiz);
          libsome_KInt (*component3)(libsome_kref_delta_OpString thiz);
          libsome_kref_delta_InsertAttributes (*component4)(libsome_kref_delta_OpString thiz);
          libsome_kref_delta_OpString (*copy)(libsome_kref_delta_OpString thiz, const char* insert, libsome_KInt retain, libsome_KInt delete_, libsome_kref_delta_InsertAttributes attributes);
          libsome_KBoolean (*equals)(libsome_kref_delta_OpString thiz, libsome_kref_kotlin_Any other);
          libsome_KInt (*hashCode)(libsome_kref_delta_OpString thiz);
          const char* (*toString)(libsome_kref_delta_OpString thiz);
          struct {
            libsome_KType* (*_type)(void);
            libsome_kref_delta_OpString_$serializer (*_instance)();
            libsome_kref_kotlinx_serialization_descriptors_SerialDescriptor (*get_descriptor)(libsome_kref_delta_OpString_$serializer thiz);
            libsome_kref_kotlin_Array (*childSerializers)(libsome_kref_delta_OpString_$serializer thiz);
            libsome_kref_delta_OpString (*deserialize)(libsome_kref_delta_OpString_$serializer thiz, libsome_kref_kotlinx_serialization_encoding_Decoder decoder);
            void (*serialize)(libsome_kref_delta_OpString_$serializer thiz, libsome_kref_kotlinx_serialization_encoding_Encoder encoder, libsome_kref_delta_OpString value);
          } $serializer;
          struct {
            libsome_KType* (*_type)(void);
            libsome_kref_delta_OpString_Companion (*_instance)();
            libsome_kref_kotlinx_serialization_KSerializer (*serializer)(libsome_kref_delta_OpString_Companion thiz);
          } Companion;
        } OpString;
      } delta;
      struct {
        const char* (*deltaToHtmlString)(const char* packet);
        const char* (*deltaToJsonString)(const char* packet);
        const char* (*htmlEncode)(const char* text);
        struct {
          libsome_KType* (*_type)(void);
          libsome_kref_parchment_ColumnNode (*ColumnNode)();
        } ColumnNode;
        struct {
          libsome_KType* (*_type)(void);
          libsome_kref_parchment_DeltaSerializer (*DeltaSerializer)();
          libsome_kref_parchment_Node (*parseToNode)(libsome_kref_parchment_DeltaSerializer thiz, const char* deltaString);
        } DeltaSerializer;
        struct {
          libsome_KType* (*_type)(void);
          libsome_kref_parchment_HeaderNode (*HeaderNode)(const char* text, libsome_KInt header);
        } HeaderNode;
        struct {
          libsome_KType* (*_type)(void);
          libsome_kref_parchment_LinkNode (*LinkNode)(const char* text, const char* link);
        } LinkNode;
        struct {
          libsome_KType* (*_type)(void);
          libsome_kref_parchment_Node (*Node)(const char* name, libsome_kref_kotlin_collections_ArrayList children);
          libsome_kref_kotlin_collections_ArrayList (*get_children)(libsome_kref_parchment_Node thiz);
          const char* (*get_name)(libsome_kref_parchment_Node thiz);
          void (*set_name)(libsome_kref_parchment_Node thiz, const char* set);
        } Node;
        struct {
          libsome_KType* (*_type)(void);
          libsome_kref_parchment_NodeSerializer (*NodeSerializer)();
          const char* (*encodeToHtmlString)(libsome_kref_parchment_NodeSerializer thiz, libsome_kref_parchment_Node node);
          const char* (*encodeToJsonString)(libsome_kref_parchment_NodeSerializer thiz, libsome_kref_parchment_Node node);
        } NodeSerializer;
        struct {
          libsome_KType* (*_type)(void);
          libsome_kref_parchment_TextNode (*TextNode)(const char* text, libsome_KBoolean bold, libsome_KBoolean italic, const char* font, libsome_KBoolean strike, libsome_KBoolean underline, const char* color, const char* background);
          const char* (*get_background)(libsome_kref_parchment_TextNode thiz);
          libsome_KBoolean (*get_bold)(libsome_kref_parchment_TextNode thiz);
          const char* (*get_color)(libsome_kref_parchment_TextNode thiz);
          const char* (*get_font)(libsome_kref_parchment_TextNode thiz);
          libsome_KBoolean (*get_italic)(libsome_kref_parchment_TextNode thiz);
          libsome_KBoolean (*get_strike)(libsome_kref_parchment_TextNode thiz);
          const char* (*get_text)(libsome_kref_parchment_TextNode thiz);
          libsome_KBoolean (*get_underline)(libsome_kref_parchment_TextNode thiz);
        } TextNode;
      } parchment;
      struct {
        const char* (*randomPassword)(libsome_KInt length, libsome_KBoolean number, libsome_KBoolean letter, libsome_KBoolean uppercaseLetter, libsome_KBoolean symbol);
        const char* (*randomString)(const char* chars, libsome_KInt length);
        struct {
          libsome_KType* (*_type)(void);
          libsome_kref_utils_StringUtils (*_instance)();
          const char* (*encodeHtml)(libsome_kref_utils_StringUtils thiz, const char* source);
        } StringUtils;
      } utils;
    } root;
  } kotlin;
} libsome_ExportedSymbols;
extern libsome_ExportedSymbols* libsome_symbols(void);
#ifdef __cplusplus
}  /* extern "C" */
#endif
#endif  /* KONAN_LIBSOME_H */
