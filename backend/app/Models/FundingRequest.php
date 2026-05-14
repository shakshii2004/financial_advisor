<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FundingRequest extends Model
{
    protected $fillable = [
        'startup_id',
        'title',
        'target_amount',
        'equity_offered',
        'pitch_details',
        'stage',
        'status',
    ];

    public function startup()
    {
        return $this->belongsTo(Startup::class);
    }

    public function interests()
    {
        return $this->hasMany(InvestorInterest::class);
    }
}
