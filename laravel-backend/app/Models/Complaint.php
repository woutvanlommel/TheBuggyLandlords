<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Complaint extends Model
{
    use HasFactory;

    // 1. Tabelnaam is enkelvoud in jouw DB
    protected $table = 'complaint';

    // 2. Geen created_at/updated_at in jouw DB
    public $timestamps = false;

    // 3. Velden die we mogen invullen via API
    protected $fillable = [
        'name',
        'description',
        'complaint_type_id',
        'user_id', // Deze hebben we net toegevoegd via migratie
    ];

    // Relaties
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function documents()
    {
        // Veel-op-veel relatie via tussentabel
        return $this->belongsToMany(Document::class, 'complaint_document', 'complaint_id', 'document_id');
    }
    
    public function type()
    {
        return $this->belongsTo(ComplaintType::class, 'complaint_type_id');
    }
}