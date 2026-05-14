<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Startup extends Model
{
    protected $casts = [
        'valuation' => 'decimal:2',
        'cap_table' => 'array',
    ];

    protected $fillable = [
        'name',
        'industry',
        'stage',
        'website',
        'description',
        'currency',
        'user_id'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function investors()
    {
        return $this->belongsToMany(User::class, 'investments', 'startup_id', 'investor_id')
                    ->withPivot('amount', 'equity_percentage', 'status')
                    ->withTimestamps();
    }

    public function fundingRequests()
    {
        return $this->hasMany(FundingRequest::class);
    }
}
