# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a collection of children's games called sg-game. The project consists of:
- A main index page (`index.html`) with a game selection interface
- Individual game subdirectories under `/games/` (currently only `tube-pour/`)
- Each game follows a standardized structure with its own HTML, CSS, JS, sounds, and tools

## Project Structure

### Overall Structure
```
sg-game/
├── index.html              # Game index page entry point
├── index.css               # Index page styles
├── README.md
├── .gitignore
│
├── shared/                 # Shared resources (optional, as needed)
│   ├── fonts.css
│   └── tokens.css
│
├── games/                  # Game subdirectories (unified entry)
│   ├── tube-pour/          # Tube pour game
│   └── <game-id>/          # Subsequent games
│
└── docs/                   # Design and implementation documentation
    ├── plans/
    └── PROJECT-STRUCTURE.md  # Structure specification
```

**Tool assignment principle:** If a tool serves only one specific game, place it in that game's `tools/` directory; if it serves multiple games or the entire project, place it in the root `tools/` directory.

### Single Game Directory Structure

Each `games/<game-id>/` **must** follow this fixed structure:

```
games/<game-id>/
├── index.html       # Main game page entry
├── css/             # All styles go in this directory
│   ├── style.css    # Main style (required)
│   └── audio.css    # Audio UI styles (when audio is present)
├── js/              # All scripts go in this directory
│   ├── game.js      # Game logic (required)
│   └── audio.js     # Audio logic (when audio is present)
├── sounds/          # Audio files (when audio is present, can be empty directory)
├── cover.png        # Index page card cover, recommended 440×220 or 2:1 ratio
└── tools/           # Game-specific tools (if present, else empty)
```

### Required Files
| Path | Description |
|------|-------------|
| `index.html` | Game main page |
| `css/style.css` | Main styles |
| `js/game.js` | Game logic |
| `cover.png` | Index page cover |

### Optional Files (As Needed)
| Path | Description |
|------|-------------|
| `css/audio.css` | Audio-related UI |
| `js/audio.js` | Audio logic |
| `sounds/*.wav` | Audio files (lowercase, hyphenated names) |

### Directory Conventions
| Directory | Purpose |
|-----------|---------|
| `css/` | All style files |
| `js/` | All script files |
| `sounds/` | Audio resources |
| `tools/` | Game-specific tools, references use `../js/game.js` etc |

## Naming Convention
| Type | Specification | Example |
|------|---------------|---------|
| Game ID | Lowercase, hyphens | `tube-pour`, `memory-match`, `match-three` |
| Game directory | Same as game-id | `games/tube-pour/` |
| Cover image | `cover.png` or `cover.jpg` | `games/tube-pour/cover.png` |
| Audio | Lowercase, hyphens, .wav | `pour.wav`, `error.wav` |
| Styles | Put in `css/`, main style `style.css`, audio UI `audio.css` | `css/style.css` |
| Scripts | Put in `js/`, logic `game.js`, audio `audio.js` | `js/game.js` |

## Path and Reference Convention
- **Index page references cover:** `games/<game-id>/cover.png`
- **Index page links to game:** `href="games/<game-id>/"`
- **Game index.html references:** `href="css/style.css"`, `href="css/audio.css"`, `src="js/game.js"`, `src="js/audio.js"`
- **Game internal fetch (e.g. audio):** `fetch("sounds/pour.wav")` (relative to current page URL)
- **Tools internal references to game files:** `__dirname + "/../js/game.js"`

## Running & Development

- Open `index.html` in a browser to access the game index
- Navigate directly to `games/tube-pour/` to play the tube pour game
- No build tools required - all games use native HTML/CSS/JS

## Tools

The project includes diagnostic tools in the `games/tube-pour/tools/` directory:
- `diagnose-levels.js` - Validates game levels
- `generate-100-levels.js` - Generates levels for the tube pour game
- `generate-sounds.html` - Sound generation utility

## Adding New Games

### Complete Checklist:
- [ ] Create `games/<game-id>/` and `css/`, `js/`, `sounds/`, `tools/` subdirectories
- [ ] Add `index.html`, referencing `css/style.css`, `js/game.js`
- [ ] If audio present: add `css/audio.css`, `js/audio.js`, `sounds/`
- [ ] Provide `cover.png`, add card in root `index.html`
- [ ] If game has exclusive tools: put in `tools/`, path like `__dirname + "/../js/game.js"`
- [ ] Update `README.md` game list

To add a new game:
1. Create a new directory `games/<game-id>/` following the structure convention
2. Add required files: `index.html`, `css/style.css`, `js/game.js`, `cover.png`
3. Update the main `index.html` to include a card linking to the new game
4. Update `README.md` to document the new game