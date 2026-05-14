<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Investment extends Model
{
    use HasFactory;

    protected $fillable = [
        'startup_id',
        'investor_id',
        'amount',
        'equity_percentage',
        'status', // e.g., 'pending', 'active', 'withdrawn'
    ];

    public function startup()
    {
        return $this->belongsTo(Startup::class);
    }

    public function investor()
    {
        return $this->belongsTo(User::class, 'investor_id');
    }
}
