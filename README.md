# Pathfinding Visualizer

An interactive web-based visualizer for exploring and comparing various pathfinding algorithms on a 2D grid.

## Overview

This visualizer demonstrates how different search algorithms navigate from a start point to a goal on a grid with obstacles. Watch in real-time as algorithms explore the environment, dynamically replan around emerging obstacles, and compare efficiency, path length, and exploration patterns.

## Algorithms

- **DFS** (Depth First Search) — Explores deep along one path before backtracking. Memory-efficient but does not guarantee the shortest path.
- **BFS** (Breadth First Search) — Explores level by level. Guarantees the shortest path on unweighted grids.
- **UCS** (Uniform Cost Search) — Expands lowest-cost paths first. Guarantees an optimal path with non-negative step costs.
- **Greedy Best First Search** — Uses a heuristic to aggressively navigate toward the goal. Fast, but not guaranteed to find the shortest path.
- **A\*** (A Star Search) — Combines actual path cost and heuristic estimate ($f(n) = g(n) + h(n)$). Efficient and optimal with admissible heuristics.

## Features

- **Interactive Grid Environment**: Easily place start and goal cells, adjust obstacle density, and customize grid dimensions.
- **Multiple Search Algorithms**: Compare DFS, BFS, UCS, Greedy Best-First, and A* in real time.
- **Heuristic Choices**: Support for Manhattan, Euclidean, and Chebyshev distance metrics for informed search.
- **Dynamic Replanning**: Real-time obstacle discovery and dynamic path recalculation.
- **Performance Metrics**: Live step logs displaying visited cell count, actual path length, optimal path length, obstacle resets, and elapsed time.
- **Playback Controls**: Run, pause, resume, clear, and reset with configurable execution speed delay.

## Getting Started

1. Open `index.html` in any modern web browser (or serve locally using `python -m http.server` / any static server).
2. Configure grid parameters, start/goal positions, and obstacle density.
3. Select your desired algorithm and heuristic.
4. Click **Run** to visualize the pathfinding process in real time.

## Project Structure

- `index.html` — Web user interface structure
- `style/style.css` — Minimal and modern dark-mode stylesheet
- `scripts/`
  - `app.js` — Core application controller and grid state manager
  - `script.js` — UI interactions, controls, and event listeners
  - `pathFinder.js` — Static pathfinding algorithm implementations
  - `pathFinderDynamic.js` — Dynamic replanning algorithm implementations
  - `minHeap.js` — Priority queue data structure for optimal search
  - `constants.js` — Algorithm metadata, heuristics, and mode definitions
  - `settings.js` — Simulator configuration and state
  - `utils.js` — Helper utilities
