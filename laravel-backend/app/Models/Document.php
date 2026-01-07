<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    use HasFactory;

    protected $table = 'document';
    
    protected $fillable = [
        'name',
        'file_path',
        'document_type_id',
        'user_id',
        'contract_id',
    ];

    // Relaties
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function contract()
    {
        return $this->belongsTo(Contract::class);
    }

    public function complaints()
    {
        return $this->belongsToMany(Complaint::class, 'complaint_document', 'document_id', 'complaint_id');
    }
}