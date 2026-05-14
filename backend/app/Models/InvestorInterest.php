<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class InvestorInterest extends Model
{
    protected $fillable = [
        'user_id',
        'startup_id',
        'funding_request_id',
        'status',
        'message',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function startup()
    {
        return $this->belongsTo(Startup::class);
    }

    public function fundingRequest()
    {
        return $this->belongsTo(FundingRequest::class);
    }
}
