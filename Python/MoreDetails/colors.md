# 🎨 Known Colors Index — Python

Discord Display Name Styles require color representations in **24-bit decimal integer format**, rather than standard hex strings (e.g. `"#FF00FF"`). This document maps color options to their decimal values and details how translation functions work in Python.

---

## 📋 Standard Decimal Colors List

Here is your core reference for pre-registered hues:

| Color Name | Hex Representation | Decimal Integer | Example Use-Case |
|---|---|---|---|
| **White** | `#FFFFFF` | `16777215` | Default elegant overlay accent |
| **Blue** | `#0016E9` | `5865` | High-tech deep blue accent |
| **Pink** | `#FF00FF` | `16711935` | Vibrant aesthetic neon glow |
| **Purple** | `#800000` | `8388736` | Heavy dark gothic contrast |

---

## 📈 Multi-Color / Gradient Pair Presets

When combining values for gradients (`effect_id: 2`) or multi-colored glow overlays, supply the integer values in order inside the payload list:

### 1. White to Blue Gradient
- **Hex Code Pair**: `#FFFFFF` + `#0016E9`
- **Decimal Representation**: `[16777215, 5865]`
- **Style Concept**: Cold, electronic glass effect. Pair with font ID `7` (Neo-Castel).

### 2. Pink to Purple Gradient
- **Hex Code Pair**: `#FF00FF` + `#800000`
- **Decimal Representation**: `[16711935, 8388736]`
- **Style Concept**: Cyberpunk high-saturation contrast. Pair with font ID `1` (Bangers) or `9` (Ribes).

### 3. Pure Cyberpunk Glow
- **Hex Code Pair**: `#00FFD2` (Cyan) + `#FF00FF` (Pink)
- **Decimal Representation**: `[65490, 16711935]`
- **Style Concept**: Distinctive neon glow aesthetic. Pair with font ID `8` (Pixelify Sans) or `10` (Sinistre).

---

## 💻 Python Conversion Functions

You can integrate these helpers directly inside your python handlers or utilities to safely convert on-the-fly:

```python
def hex_to_decimal(hex_code: str) -> int:
    """
    Converts a standard Hex string (e.g., "#FF00FF" or "FF00FF") to a Discord-compatible 24-bit decimal integer.
    """
    sanitized = hex_code.replace("#", "").strip()
    try:
        parsed = int(sanitized, 16)
    except ValueError:
        raise ValueError(f"Invalid hexadecimal color input: {hex_code}")
    
    if parsed < 0 or parsed > 0xffffff:
        raise ValueError(f"Hex color code out of 24-bit bounds: {hex_code}")
    return parsed


def decimal_to_hex(decimal: int) -> str:
    """
    Converts a Discord-compatible 24-bit decimal integer back to a formatted Hex string.
    """
    if decimal < 0 or decimal > 0xffffff:
        raise ValueError(f"Invalid decimal color input: {decimal}")
    
    hex_str = hex(decimal)[2:].upper()
    return f"#{hex_str.zfill(6)}"


# Example usage:
dec_color = hex_to_decimal("#FF00FF") # Returns 16711935
hex_color = decimal_to_hex(5865)       # Returns "#0016E9"
```
