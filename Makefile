WASI_SDK_PATH = wasi-sdk-12.0

CC = ./$(WASI_SDK_PATH)/bin/clang \
	--target=wasm32-unknown-wasi \
	--sysroot=$(WASI_SDK_PATH)/share/wasi-sysroot \
	-O3 \
	-flto \

BUILD_FLAGS = -lm \
	-Wl,--export-all \
	-Wl,--no-entry \
	-nostartfiles \
	-Wl,--lto-O3

OUT_DIR = dist
OBJECTS_DIR = object

SOURCE_DIR = core

OUTPUT = $(OUT_DIR)/core.wasm

OBJECTS = $(OBJECTS_DIR)/test.o

build: $(WASI_SDK_PATH) $(OUT_DIR) $(OBJECTS_DIR) $(OUTPUT)

$(WASI_SDK_PATH):
	wget https://github.com/WebAssembly/wasi-sdk/releases/download/wasi-sdk-12/wasi-sdk-12.0-linux.tar.gz
	tar -xvzf wasi-sdk-12.0-linux.tar.gz
	rm wasi-sdk-12.0-linux.tar.gz

$(OUT_DIR):
	mkdir $(OUT_DIR)

$(OBJECTS_DIR):
	mkdir $(OBJECTS_DIR)

$(OUTPUT): $(OBJECTS)
	$(CC) $(BUILD_FLAGS) $(OBJECTS) -o $(OUTPUT)

$(OBJECTS_DIR)/%.o: $(SOURCE_DIR)/%.c
	$(CC) -c $< -o $@
