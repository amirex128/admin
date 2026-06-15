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
        $this->run("graphify exract . --backend ollama --model qwen3.5:4b --wiki --update --mode deep --directed --obsidian  --dedup-llm ");
        $this->run("graphify cluster-only . --wiki --obsidian --update");
        $this->run("graphify update .");
    }
}
