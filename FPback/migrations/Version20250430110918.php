<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250430110918 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE product_all_data (id INT AUTO_INCREMENT NOT NULL, warehouse_id INT NOT NULL, name VARCHAR(255) NOT NULL, brand VARCHAR(255) NOT NULL, price DOUBLE PRECISION NOT NULL, stock INT NOT NULL, product_type VARCHAR(255) NOT NULL, entry_date DATETIME NOT NULL, expiration_date DATETIME DEFAULT NULL, weight INT NOT NULL, dimensions INT NOT NULL, product_photo VARCHAR(255) DEFAULT NULL, purchase_price DOUBLE PRECISION NOT NULL, INDEX IDX_B707880E5080ECDE (warehouse_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE product_sold (id INT AUTO_INCREMENT NOT NULL, product_data_id INT NOT NULL, warehouse_id INT NOT NULL, quantity INT NOT NULL, sale_date DATETIME NOT NULL, purchase_price DOUBLE PRECISION NOT NULL, name VARCHAR(255) NOT NULL, brand VARCHAR(255) NOT NULL, price DOUBLE PRECISION NOT NULL, product_type VARCHAR(255) NOT NULL, expiration_date DATE NOT NULL, weight DOUBLE PRECISION NOT NULL, dimensions DOUBLE PRECISION NOT NULL, entry_date DATE NOT NULL, product_photo VARCHAR(255) NOT NULL, INDEX IDX_153AFF38E62CBA8C (product_data_id), INDEX IDX_153AFF385080ECDE (warehouse_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE user (id INT AUTO_INCREMENT NOT NULL, user_name VARCHAR(255) NOT NULL, company_name VARCHAR(255) NOT NULL, email VARCHAR(255) NOT NULL, password VARCHAR(255) NOT NULL, role VARCHAR(255) NOT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE warehouse (id INT AUTO_INCREMENT NOT NULL, user_id INT NOT NULL, name VARCHAR(255) NOT NULL, location VARCHAR(255) NOT NULL, INDEX IDX_ECB38BFCA76ED395 (user_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('CREATE TABLE messenger_messages (id BIGINT AUTO_INCREMENT NOT NULL, body LONGTEXT NOT NULL, headers LONGTEXT NOT NULL, queue_name VARCHAR(190) NOT NULL, created_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', available_at DATETIME NOT NULL COMMENT \'(DC2Type:datetime_immutable)\', delivered_at DATETIME DEFAULT NULL COMMENT \'(DC2Type:datetime_immutable)\', INDEX IDX_75EA56E0FB7336F0 (queue_name), INDEX IDX_75EA56E0E3BD61CE (available_at), INDEX IDX_75EA56E016BA31DB (delivered_at), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
        $this->addSql('ALTER TABLE product_all_data ADD CONSTRAINT FK_B707880E5080ECDE FOREIGN KEY (warehouse_id) REFERENCES warehouse (id)');
        $this->addSql('ALTER TABLE product_sold ADD CONSTRAINT FK_153AFF38E62CBA8C FOREIGN KEY (product_data_id) REFERENCES product_all_data (id)');
        $this->addSql('ALTER TABLE product_sold ADD CONSTRAINT FK_153AFF385080ECDE FOREIGN KEY (warehouse_id) REFERENCES warehouse (id)');
        $this->addSql('ALTER TABLE warehouse ADD CONSTRAINT FK_ECB38BFCA76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE product_all_data DROP FOREIGN KEY FK_B707880E5080ECDE');
        $this->addSql('ALTER TABLE product_sold DROP FOREIGN KEY FK_153AFF38E62CBA8C');
        $this->addSql('ALTER TABLE product_sold DROP FOREIGN KEY FK_153AFF385080ECDE');
        $this->addSql('ALTER TABLE warehouse DROP FOREIGN KEY FK_ECB38BFCA76ED395');
        $this->addSql('DROP TABLE product_all_data');
        $this->addSql('DROP TABLE product_sold');
        $this->addSql('DROP TABLE user');
        $this->addSql('DROP TABLE warehouse');
        $this->addSql('DROP TABLE messenger_messages');
    }
}
