<?php

namespace App\Services;

use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class DocumentService
{
    /**
     * Uploads a file, hashes it (MD5), and updates/creates the database record.
     *
     * @param  mixed        $user      The user model (auth()->user())
     * @param  UploadedFile $file      The actual file from the request
     * @param  int          $typeId    The ID from your document_types table (e.g., 8 for Profile)
     * @param  string       $folder    Folder inside 'storage/app/public' (default: 'documents')
     * @return string                  The public URL of the file
     */
    public function uploadForUser($user, UploadedFile $file, int $typeId, string $folder = 'document')
    {
        // 1. GENERATE HASH NAME
        // md5_file() reads the file content and creates a 32-char signature.
        // If 2 users upload the same image, they get the same filename (saving storage).
        $hashName = md5_file($file->getRealPath());
        $extension = $file->getClientOriginalExtension();
        $fileName = $hashName . '.' . $extension;

        // 2. SAVE TO STORAGE
        // This saves to storage/app/public/{folder}
        $path = $file->storeAs($folder, $fileName, 'public');
        $publicUrl = '/storage/' . $path;

        // 3. DATABASE LOGIC (Upsert)
        // Check if this user already has this specific document type
        $existingDoc = DB::table('document')
            ->where('user_id', $user->id)
            ->where('document_type_id', $typeId)
            ->first();

        if ($existingDoc) {
            // Update existing record
            DB::table('document')
                ->where('id', $existingDoc->id)
                ->update([
                    'file_path' => $publicUrl,
                    'name' => $fileName, // Storing the hash name
                    'updated_at' => now(),
                ]);
        } else {
            // Create new record
            DB::table('document')->insert([
                'user_id' => $user->id,
                'document_type_id' => $typeId,
                'name' => $fileName,
                'file_path' => $publicUrl,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        return $publicUrl;
    }
}
