#!/usr/bin/env node
/**
 * Waline SQLite 表结构初始化（幂等，可重复执行）。
 *
 * 背景：SQLite 场景下 Waline 不会自动建表；本脚本直接使用服务依赖的
 * better-sqlite3 在 SQLITE_PATH 下创建三张表（wl_Comment / wl_Counter /
 * wl_Users）及其索引。表结构对齐官方 assets/waline.sqlite 与 waline.sql。
 *
 * 用法（在 /var/www/waline 下，已装好 node_modules）：
 *   SQLITE_PATH=/var/www/waline/data SQLITE_DB=waline SQLITE_PREFIX=wl_ \
 *     node init-sqlite.cjs
 *
 * 不传环境变量时按 .env.example 默认值兜底。
 */
const path = require('path');
const fs = require('fs');

const sqlitePath = process.env.SQLITE_PATH || path.join(__dirname, 'data');
const sqliteDb = process.env.SQLITE_DB || 'waline';
const prefix = process.env.SQLITE_PREFIX || 'wl_';

fs.mkdirSync(sqlitePath, { recursive: true });
const dbFile = path.join(sqlitePath, `${sqliteDb}.sqlite`);

// 优先使用应用安装的 better-sqlite3，其次回退到脚本同级 node_modules。
let Database;
try {
  Database = require(path.join(__dirname, 'node_modules', 'better-sqlite3'));
} catch (e) {
  Database = require('better-sqlite3');
}

const db = new Database(dbFile);
db.pragma('journal_mode = DELETE');

const table = (name) => `${prefix}${name}`;

const statements = [
  `CREATE TABLE IF NOT EXISTS "${table('Comment')}" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "user_id" INTEGER,
    "comment" TEXT,
    "insertedAt" DATETIME DEFAULT (datetime('now', 'localtime')),
    "ip" TEXT,
    "link" TEXT,
    "mail" TEXT,
    "nick" TEXT,
    "rid" INTEGER,
    "pid" INTEGER,
    "sticky" NUMERIC,
    "status" TEXT NOT NULL DEFAULT '',
    "like" INTEGER,
    "ua" TEXT,
    "url" TEXT,
    "createdAt" DATETIME DEFAULT (datetime('now', 'localtime')),
    "updatedAt" DATETIME DEFAULT (datetime('now', 'localtime'))
  );`,

  `CREATE INDEX IF NOT EXISTS "idx_comment_url" ON "${table('Comment')}" ("url");`,
  `CREATE INDEX IF NOT EXISTS "idx_comment_user_id" ON "${table('Comment')}" ("user_id");`,
  `CREATE INDEX IF NOT EXISTS "idx_comment_status" ON "${table('Comment')}" ("status");`,
  `CREATE INDEX IF NOT EXISTS "idx_comment_pid_rid" ON "${table('Comment')}" ("pid", "rid");`,
  `CREATE INDEX IF NOT EXISTS "idx_comment_created_at" ON "${table('Comment')}" ("createdAt");`,
  `CREATE INDEX IF NOT EXISTS "idx_comment_updated_at" ON "${table('Comment')}" ("updatedAt");`,
  `CREATE INDEX IF NOT EXISTS "idx_comment_sticky" ON "${table('Comment')}" ("sticky");`,

  `CREATE TABLE IF NOT EXISTS "${table('Counter')}" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "time" INTEGER,
    "reaction0" INTEGER,
    "reaction1" INTEGER,
    "reaction2" INTEGER,
    "reaction3" INTEGER,
    "reaction4" INTEGER,
    "reaction5" INTEGER,
    "reaction6" INTEGER,
    "reaction7" INTEGER,
    "reaction8" INTEGER,
    "url" TEXT NOT NULL DEFAULT '',
    "createdAt" DATETIME DEFAULT (datetime('now', 'localtime')),
    "updatedAt" DATETIME DEFAULT (datetime('now', 'localtime'))
  );`,

  `CREATE INDEX IF NOT EXISTS "idx_counter_url" ON "${table('Counter')}" ("url");`,
  `CREATE INDEX IF NOT EXISTS "idx_counter_time" ON "${table('Counter')}" ("time");`,
  `CREATE INDEX IF NOT EXISTS "idx_counter_created_at" ON "${table('Counter')}" ("createdAt");`,

  `CREATE TABLE IF NOT EXISTS "${table('Users')}" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT,
    "display_name" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL DEFAULT '',
    "password" TEXT NOT NULL DEFAULT '',
    "type" TEXT NOT NULL DEFAULT '',
    "label" TEXT,
    "url" TEXT,
    "avatar" TEXT,
    "github" TEXT,
    "twitter" TEXT,
    "facebook" TEXT,
    "google" TEXT,
    "weibo" TEXT,
    "qq" TEXT,
    "oidc" TEXT,
    "huawei" TEXT,
    "2fa" TEXT,
    "createdAt" DATETIME DEFAULT (datetime('now', 'localtime')),
    "updatedAt" DATETIME DEFAULT (datetime('now', 'localtime'))
  );`,

  `CREATE UNIQUE INDEX IF NOT EXISTS "idx_user_email" ON "${table('Users')}" ("email");`,
  `CREATE INDEX IF NOT EXISTS "idx_user_type" ON "${table('Users')}" ("type");`,
  `CREATE INDEX IF NOT EXISTS "idx_user_created_at" ON "${table('Users')}" ("createdAt");`,
];

for (const sql of statements) {
  db.exec(sql);
}

const tables = db
  .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE ? ORDER BY name")
  .all(`${prefix}%`)
  .map((r) => r.name);

console.log(`SQLite 已初始化：${dbFile}`);
console.log('数据表：' + tables.join(', '));
db.close();
