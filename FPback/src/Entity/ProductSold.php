<?php

namespace App\Entity;

use App\Repository\ProductSoldRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ProductSoldRepository::class)]
class ProductSold
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: ProductAllData::class)]
    #[ORM\JoinColumn(nullable: false)]
    private ?ProductAllData $productData = null;

    #[ORM\ManyToOne(targetEntity: Warehouse::class, inversedBy: "sales")]
    #[ORM\JoinColumn(nullable: false)]
    private ?Warehouse $warehouse = null;

    #[ORM\Column]
    private ?int $quantity = null;

    #[ORM\Column(type: "datetime")]
    private ?\DateTimeInterface $sale_date = null;

    /**
     * @return int|null
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * @param int|null $id
     */
    public function setId($id)
    {
        $this->id = $id;
    }

    /**
     * @return \DateTimeInterface|null
     */
    public function getSaleDate()
    {
        return $this->sale_date;
    }

    /**
     * @param \DateTimeInterface|null $sale_date
     */
    public function setSaleDate($sale_date)
    {
        $this->sale_date = $sale_date;
    }

    /**
     * @return int|null
     */
    public function getQuantity()
    {
        return $this->quantity;
    }

    /**
     * @param int|null $quantity
     */
    public function setQuantity($quantity)
    {
        $this->quantity = $quantity;
    }

    /**
     * @return Warehouse|null
     */
    public function getWarehouse()
    {
        return $this->warehouse;
    }

    /**
     * @param Warehouse|null $warehouse
     */
    public function setWarehouse($warehouse)
    {
        $this->warehouse = $warehouse;
    }

    /**
     * @return ProductAllData|null
     */
    public function getProductData()
    {
        return $this->productData;
    }

    /**
     * @param ProductAllData|null $productData
     */
    public function setProductData($productData)
    {
        $this->productData = $productData;
    }

}