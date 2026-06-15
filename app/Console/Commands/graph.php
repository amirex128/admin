<?php

namespace App\Console\Commands;

use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;

#[Signature('app:graph')]
#[Description('Command description')]
class graph extends Command
{
    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->run("graphify . --backend ollama --model qwen3.5:4b");
    }
}
