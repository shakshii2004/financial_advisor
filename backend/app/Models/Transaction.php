<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'startup_id',
        'type',
        'category',
        'amount',
        'date',
        'description',
        'status',
        'currency',
    ];

    public function startup()
    {
        return $this->belongsTo(Startup::class);
    }
}
