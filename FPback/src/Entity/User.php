<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;

#[ORM\Entity(repositoryClass: UserRepository::class)]
class User
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $user_name = null;

    #[ORM\Column(length: 255)]
    private ?string $company_name = null;

    #[ORM\Column(length: 255)]
    private ?string $email = null;

    #[ORM\Column(length: 255)]
    private ?string $password = null;

    #[ORM\Column(length: 255)]
    private ?string $role = null;

    #[ORM\OneToMany(mappedBy: "user", targetEntity: Warehouse::class)]
    private Collection $warehouses;

    public function __construct()
    {
        $this->warehouses = new ArrayCollection();
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
     * @return Collection
     */
    public function getWarehouses()
    {
        return $this->warehouses;
    }

    /**
     * @param Collection $warehouses
     */
    public function setWarehouses($warehouses)
    {
        $this->warehouses = $warehouses;
    }

    /**
     * @return string|null
     */
    public function getRole()
    {
        return $this->role;
    }

    /**
     * @param string|null $role
     */
    public function setRole($role)
    {
        $this->role = $role;
    }

    /**
     * @return string|null
     */
    public function getPassword()
    {
        return $this->password;
    }

    /**
     * @param string|null $password
     */
    public function setPassword($password)
    {
        $this->password = $password;
    }

    /**
     * @return string|null
     */
    public function getCompanyName()
    {
        return $this->company_name;
    }

    /**
     * @param string|null $company_name
     */
    public function setCompanyName($company_name)
    {
        $this->company_name = $company_name;
    }

    /**
     * @return string|null
     */
    public function getEmail()
    {
        return $this->email;
    }

    /**
     * @param string|null $email
     */
    public function setEmail($email)
    {
        $this->email = $email;
    }

    /**
     * @return string|null
     */
    public function getUserName()
    {
        return $this->user_name;
    }

    /**
     * @param string|null $user_name
     */
    public function setUserName($user_name)
    {
        $this->user_name = $user_name;
    }

}