<?php

namespace App\Entity;

use App\Repository\WarehouseRepository;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

#[ORM\Entity(repositoryClass: WarehouseRepository::class)]
class Warehouse
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\ManyToOne(targetEntity: User::class, inversedBy: "warehouses")]
    #[ORM\JoinColumn(nullable: false)]
    private ?User $user = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(length: 255)]
    private ?string $location = null;

    #[ORM\OneToMany(mappedBy: "warehouse", targetEntity: ProductAllData::class, cascade: ["persist", "remove"])]
    private Collection $products;

    #[ORM\OneToMany(mappedBy: "warehouse", targetEntity: ProductSold::class, cascade: ["persist", "remove"])]
    private Collection $sales;

    public function __construct()
    {
        $this->products = new ArrayCollection();
        $this->sales = new ArrayCollection();
    }

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
     * @return User|null
     */
    public function getUser()
    {
        return $this->user;
    }

    /**
     * @param User|null $user
     */
    public function setUser($user)
    {
        $this->user = $user;
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
     * @return string|null
     */
    public function getLocation()
    {
        return $this->location;
    }

    /**
     * @param string|null $location
     */
    public function setLocation($location)
    {
        $this->location = $location;
    }

    /**
     * @return Collection
     */
    public function getProducts()
    {
        return $this->products;
    }

    /**
     * @param Collection $products
     */
    public function setProducts($products)
    {
        $this->products = $products;
    }

    /**
     * @return Collection
     */
    public function getSales()
    {
        return $this->sales;
    }

    /**
     * @param Collection $sales
     */
    public function setSales($sales)
    {
        $this->sales = $sales;
    }


}
