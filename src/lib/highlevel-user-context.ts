import { createHash, createDecipheriv } from "node:crypto";

export type HighLevelUserContext = {
  userId: string;
  companyId: string;
  activeLocation: string;
  role: string;
  type: string;
  email: string;
  displayName: string;
};

function text(...values: unknown[]) {
  return (
    values
      .find((value): value is string => typeof value === "string" && value.trim().length > 0)
      ?.trim() ?? ""
  );
}

function evpBytesToKey(passphrase: Buffer, salt: Buffer, keyLength: number, ivLength: number) {
  const needed = keyLength + ivLength;
  const chunks: Buffer[] = [];
  let previous = Buffer.alloc(0);
  let total = 0;
  while (total < needed) {
    previous = createHash("md5")
      .update(Buffer.concat([previous, passphrase, salt]))
      .digest();
    chunks.push(previous);
    total += previous.length;
  }
  const derived = Buffer.concat(chunks);
  return { key: derived.subarray(0, keyLength), iv: derived.subarray(keyLength, needed) };
}

/**
 * HighLevel's documented signed user-context payload is CryptoJS AES output.
 * CryptoJS's passphrase mode uses the OpenSSL salted format and EVP_BytesToKey.
 * Decryption stays server-side; the shared secret is never sent to the browser.
 */
export function decryptHighLevelUserContext(
  encryptedData: string,
  sharedSecret: string,
): HighLevelUserContext | null {
  if (!encryptedData.trim() || !sharedSecret.trim()) return null;
  try {
    const encoded = Buffer.from(encryptedData.trim(), "base64");
    const hasSalt = encoded.subarray(0, 8).toString("ascii") === "Salted__";
    const salt = hasSalt ? encoded.subarray(8, 16) : Buffer.alloc(0);
    const ciphertext = hasSalt ? encoded.subarray(16) : encoded;
    if (!ciphertext.length || (hasSalt && salt.length !== 8)) return null;
    const { key, iv } = evpBytesToKey(Buffer.from(sharedSecret, "utf8"), salt, 32, 16);
    const decipher = createDecipheriv("aes-256-cbc", key, iv);
    const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]).toString(
      "utf8",
    );
    const parsed = JSON.parse(plaintext) as Record<string, unknown>;
    const userId = text(parsed.userId, parsed.user_id);
    const companyId = text(parsed.companyId, parsed.company_id);
    const activeLocation = text(parsed.activeLocation, parsed.active_location, parsed.locationId);
    const role = text(parsed.role).toLowerCase();
    const type = text(parsed.type).toLowerCase();
    const email = text(parsed.email).toLowerCase();
    const displayName = text(parsed.userName, parsed.user_name, parsed.name, email);
    if (!userId || !companyId || !activeLocation || !role || !type || !email) return null;
    return { userId, companyId, activeLocation, role, type, email, displayName };
  } catch {
    return null;
  }
}
