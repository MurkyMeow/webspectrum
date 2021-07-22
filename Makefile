WASI_SDK = wasi-sdk-12.0

CC = ./$(WASI_SDK)/bin/clang \
	--target=wasm32-unknown-wasi \
	--sysroot=$(WASI_SDK)/share/wasi-sysroot \
	-O3 \
	-flto \

BUILD_FLAGS = -lm \
	-Wl,--export-all \
	-Wl,--no-entry \
	-nostartfiles \
	-Wl,--lto-O3

OUT_DIR = dist
CACHE_DIR = cache
SOURCE_DIR = core

OUTPUT = $(OUT_DIR)/core.wasm

OBJECTS = $(CACHE_DIR)/main.o \
	$(CACHE_DIR)/wav.o \
	$(CACHE_DIR)/dft.o

JAVASCRIPT = $(OUT_DIR)/index.js

build: $(WASI_SDK) $(OUT_DIR) $(CACHE_DIR) $(JAVASCRIPT) $(OUTPUT)

$(WASI_SDK):
	wget https://github.com/WebAssembly/wasi-sdk/releases/download/wasi-sdk-12/wasi-sdk-12.0-linux.tar.gz
	tar -xvzf wasi-sdk-12.0-linux.tar.gz
	rm wasi-sdk-12.0-linux.tar.gz

$(OUT_DIR):
	mkdir $(OUT_DIR)

$(CACHE_DIR):
	mkdir $(CACHE_DIR)

$(OUTPUT): $(OBJECTS)
	$(CC) $(BUILD_FLAGS) $(OBJECTS) -o $(OUTPUT)

$(CACHE_DIR)/%.o: $(SOURCE_DIR)/%.c
	$(CC) -c $< -o $@

$(OUT_DIR)/%.js: web/%.ts
	npx tsc --outDir $(OUT_DIR) $<
