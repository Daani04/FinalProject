<?php

namespace App\Entity;

use App\Repository\ProductAllDataRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ProductAllDataRepository::class)]
class ProductAllData
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: Warehouse::class, inversedBy: "products")]
    #[ORM\JoinColumn(nullable: false)]
    private ?Warehouse $warehouse = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    private ?string $brand = null;

    #[ORM\Column(type: "float")]
    private ?float $price = null;

    #[ORM\Column]
    private ?int $stock = null;

    #[ORM\Column(length: 255)]
    private ?string $product_type = null;

    #[ORM\Column(type: "datetime")]
    private ?\DateTimeInterface $entry_date = null;

    #[ORM\Column(type: "datetime", nullable: true)]
    private ?\DateTimeInterface $expiration_date = null;

    #[ORM\Column(type: "datetime", nullable: true)]
    private ?\DateTimeInterface $warranty_period = null;

    #[ORM\Column]
    private ?int $weight = null;

    #[ORM\Column]
    private ?int $dimensions = null;

    #[ORM\Column(length: 255, nullable: true)]
    private ?string $product_photo = null;

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
     * @return string|null
     */
    public function getProductPhoto()
    {
        return $this->product_photo;
    }

    /**
     * @param string|null $product_photo
     */
    public function setProductPhoto($product_photo)
    {
        $this->product_photo = $product_photo;
    }

    /**
     * @return int|null
     */
    public function getDimensions()
    {
        return $this->dimensions;
    }

    /**
     * @param int|null $dimensions
     */
    public function setDimensions($dimensions)
    {
        $this->dimensions = $dimensions;
    }

    /**
     * @return int|null
     */
    public function getWeight()
    {
        return $this->weight;
    }

    /**
     * @param int|null $weight
     */
    public function setWeight($weight)
    {
        $this->weight = $weight;
    }

    /**
     * @return \DateTimeInterface|null
     */
    public function getWarrantyPeriod()
    {
        return $this->warranty_period;
    }

    /**
     * @param \DateTimeInterface|null $warranty_period
     */
    public function setWarrantyPeriod($warranty_period)
    {
        $this->warranty_period = $warranty_period;
    }

    /**
     * @return \DateTimeInterface|null
     */
    public function getExpirationDate()
    {
        return $this->expiration_date;
    }

    /**
     * @param \DateTimeInterface|null $expiration_date
     */
    public function setExpirationDate($expiration_date)
    {
        $this->expiration_date = $expiration_date;
    }

    /**
     * @return \DateTimeInterface|null
     */
    public function getEntryDate()
    {
        return $this->entry_date;
    }

    /**
     * @param \DateTimeInterface|null $entry_date
     */
    public function setEntryDate($entry_date)
    {
        $this->entry_date = $entry_date;
    }

    /**
     * @return string|null
     */
    public function getProductType()
    {
        return $this->product_type;
    }

    /**
     * @param string|null $product_type
     */
    public function setProductType($product_type)
    {
        $this->product_type = $product_type;
    }

    /**
     * @return int|null
     */
    public function getStock()
    {
        return $this->stock;
    }

    /**
     * @param int|null $stock
     */
    public function setStock($stock)
    {
        $this->stock = $stock;
    }

    /**
     * @return float|null
     */
    public function getPrice()
    {
        return $this->price;
    }

    /**
     * @param float|null $price
     */
    public function setPrice($price)
    {
        $this->price = $price;
    }

    /**
     * @return string|null
     */
    public function getBrand()
    {
        return $this->brand;
    }

    /**
     * @param string|null $brand
     */
    public function setBrand($brand)
    {
        $this->brand = $brand;
    }

    /**
     * @return string|null
     */
    public function getName()
    {
        return $this->name;
    }

    /**
     * @param string|null $name
     */
    public function setName($name)
    {
        $this->name = $name;
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


}