<?php

namespace App\Entity;

use App\Repository\ApiProductSoldControllerRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ApiProductSoldControllerRepository::class)]
class ApiProductSoldController
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column]
    private ?bool $purchasePrice = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function isPurchasePrice(): ?bool
    {
        return $this->purchasePrice;
    }

    public function setPurchasePrice(bool $purchasePrice): static
    {
        $this->purchasePrice = $purchasePrice;

        return $this;
    }
}
