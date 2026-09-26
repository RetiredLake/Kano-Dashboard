#include <cstdint>

#if defined(__EMSCRIPTEN__)
#include <emscripten/emscripten.h>
#define MCPI_EXPORT EMSCRIPTEN_KEEPALIVE
#else
#define MCPI_EXPORT
#endif

namespace {
constexpr std::uint32_t kCapacity = 1u << 17;
constexpr std::uint32_t kMask = kCapacity - 1;
constexpr std::uint8_t kEmpty = 0;
constexpr std::uint8_t kFull = 1;
constexpr std::uint8_t kDeleted = 2;

struct BlockCell {
  std::int32_t x;
  std::int32_t y;
  std::int32_t z;
  std::int32_t id;
  std::int32_t data;
  std::uint8_t state;
};

BlockCell cells[kCapacity]{};
std::uint32_t blockCount = 0;

std::uint32_t hashPosition(std::int32_t x, std::int32_t y, std::int32_t z) {
  std::uint32_t value = static_cast<std::uint32_t>(x) * 0x9e3779b1u;
  value ^= static_cast<std::uint32_t>(y) * 0x85ebca6bu;
  value ^= static_cast<std::uint32_t>(z) * 0xc2b2ae35u;
  value ^= value >> 16;
  value *= 0x7feb352du;
  value ^= value >> 15;
  return value & kMask;
}

std::int32_t findCell(std::int32_t x, std::int32_t y, std::int32_t z, bool inserting) {
  std::uint32_t index = hashPosition(x, y, z);
  std::int32_t firstDeleted = -1;
  for (std::uint32_t scanned = 0; scanned < kCapacity; ++scanned, index = (index + 1) & kMask) {
    const BlockCell& cell = cells[index];
    if (cell.state == kFull && cell.x == x && cell.y == y && cell.z == z) return static_cast<std::int32_t>(index);
    if (cell.state == kDeleted && firstDeleted < 0) firstDeleted = static_cast<std::int32_t>(index);
    if (cell.state == kEmpty) return inserting ? (firstDeleted >= 0 ? firstDeleted : static_cast<std::int32_t>(index)) : -1;
  }
  return inserting ? firstDeleted : -1;
}
}  // namespace

extern "C" {
MCPI_EXPORT int mcpi_wasm_abi_version() { return 1; }

MCPI_EXPORT int mcpi_wasm_set_block(int x, int y, int z, int id, int data) {
  if (id < 0 || id > 255) return -1;
  const std::int32_t index = findCell(x, y, z, id != 0);
  if (id == 0) {
    if (index >= 0) {
      cells[index].state = kDeleted;
      --blockCount;
    }
    return 0;
  }
  if (index < 0) return -2;
  BlockCell& cell = cells[index];
  if (cell.state != kFull) {
    cell.x = x;
    cell.y = y;
    cell.z = z;
    cell.state = kFull;
    ++blockCount;
  }
  cell.id = id;
  cell.data = data;
  return 0;
}

MCPI_EXPORT int mcpi_wasm_get_block(int x, int y, int z) {
  const std::int32_t index = findCell(x, y, z, false);
  return index < 0 ? 0 : cells[index].id;
}

MCPI_EXPORT int mcpi_wasm_get_data(int x, int y, int z) {
  const std::int32_t index = findCell(x, y, z, false);
  return index < 0 ? 0 : cells[index].data;
}

MCPI_EXPORT int mcpi_wasm_block_count() { return static_cast<int>(blockCount); }

MCPI_EXPORT void mcpi_wasm_clear() {
  for (std::uint32_t index = 0; index < kCapacity; ++index) cells[index].state = kEmpty;
  blockCount = 0;
}
}
