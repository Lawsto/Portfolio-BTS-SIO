<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

function respond(int $status, array $payload): void {
  http_response_code($status);
  echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
  exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
  respond(405, ['ok' => false, 'error' => 'Méthode non autorisée']);
}

// Supporte JSON (fetch) et form-urlencoded (fallback)
$contentType = strtolower($_SERVER['CONTENT_TYPE'] ?? '');
$raw = file_get_contents('php://input') ?: '';
$data = [];

if (str_contains($contentType, 'application/json')) {
  $decoded = json_decode($raw, true);
  if (is_array($decoded)) {
    $data = $decoded;
  }
} else {
  $data = $_POST;
}

$name = trim((string)($data['name'] ?? ''));
$email = trim((string)($data['email'] ?? ''));
$message = trim((string)($data['message'] ?? ''));
$honeypot = trim((string)($data['website'] ?? ''));

// Anti-spam simple
if ($honeypot !== '') {
  respond(200, ['ok' => true]);
}

if ($name === '' || $email === '' || $message === '') {
  respond(400, ['ok' => false, 'error' => 'Champs manquants']);
}

if (mb_strlen($name) < 2) {
  respond(400, ['ok' => false, 'error' => 'Nom trop court']);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
  respond(400, ['ok' => false, 'error' => 'Email invalide']);
}

if (mb_strlen($message) < 10) {
  respond(400, ['ok' => false, 'error' => 'Message trop court']);
}

// Stockage local (utile en XAMPP) : data/contacts.ndjson
$baseDir = dirname(__DIR__);
$dataDir = $baseDir . DIRECTORY_SEPARATOR . 'data';
$logFile = $dataDir . DIRECTORY_SEPARATOR . 'contacts.ndjson';

if (!is_dir($dataDir)) {
  @mkdir($dataDir, 0755, true);
}

$entry = [
  'ts' => gmdate('c'),
  'ip' => (string)($_SERVER['REMOTE_ADDR'] ?? ''),
  'ua' => (string)($_SERVER['HTTP_USER_AGENT'] ?? ''),
  'name' => $name,
  'email' => $email,
  'message' => $message,
];

// Tentative d'écriture (si ça échoue, on renvoie une erreur claire)
$line = json_encode($entry, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n";
if (@file_put_contents($logFile, $line, FILE_APPEND | LOCK_EX) === false) {
  respond(500, ['ok' => false, 'error' => 'Impossible d’enregistrer le message côté serveur']);
}

// Optionnel : envoi mail() si configuré côté serveur
// (XAMPP n’a souvent pas de SMTP configuré : le log restera la source fiable.)

respond(200, ['ok' => true]);

