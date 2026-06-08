# Wikidocs Study TOC Restructure Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Expand the 금융공기업 IT study ebook into a 2~3-level subject-based learning structure with templates, core-summary links, and topic-based past-question indexes.

**Architecture:** Keep the existing Wikidocs Markdown repository structure: `TOC.md` is the single navigation source and `pages/*.md` contains page content. Preserve existing source pages and add focused new pages with consistent learning templates rather than moving or deleting original material.

**Tech Stack:** Markdown, Wikidocs-compatible TOC indentation, Python 3 link validation script, git.

---

## Tasks

1. Add `scripts/validate_toc_links.py` that validates all `TOC.md` page links exist and the removed `01-1-1-테스트-세부-목차` page is absent; run it and commit.
2. Expand `TOC.md` to include 05 topic indexes and 06~13 nested subject pages.
3. Convert 06~13 top-level subject pages into learning hub pages.
4. Create all 06~13 detail pages with non-empty template sections and topic-specific summaries.
5. Create 05-9~05-13 topic index pages.
6. Run validation, confirm no test page, review diff, push/merge as appropriate.
