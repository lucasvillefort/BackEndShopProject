create database pdv;
create table usuarios(
	id serial primary key,
  nome text not null,
  email text unique not null,
  senha text not null
);

create table categorias(
	id serial primary key,
  descricao text
);


insert into categorias (descricao) values
('Informática'),
('Celulares'),
('Beleza e Perfumaria'),
('Mercado'),
('Livros e Papelaria'),
('Brinquedos'),
('Moda'),
('Bebê'),
('Games');


drop table produtos;
create table produtos (
	id serial primary key,
  descricao text not null,
  quantidade_estoque int not null,
  valor int not null,
  categoria_id int not null,
  usuarios_id int not null,
  produto_imagem text,
  path_image text, 
  constraint produtos_categoras foreign key(categoria_id) references categorias(id),
  constraint produtos_usuarios foreign key(usuarios_id) references usuarios(id)
); 

drop table clientes;
create table clientes (
	id serial primary key,
	nome text not null,
	email text not null unique,
	cpf text not null unique,
	cep text not null ,
	rua text not null ,
	numero int not null,
	bairro text not null ,
	cidade text not null ,
	estado text not null ,
  usuarios_id int not null,
  constraint clientes_usuarios foreign key(usuarios_id) references usuarios(id)
);
drop table pedidos;
create table pedidos (
	id serial primary key,
	cliente_id int,
	observacao text,
	valor_total int,
  constraint clientes_pedidos foreign key(cliente_id) references clientes(id)
);

drop table pedido_produtos;
create table pedido_produtos (
	id serial primary key,
	pedido_id int, 
	produto_id int,
	quantidade_produto int  not null,
	valor_produto int not null,
  constraint pedido_produtos_pedidos foreign key(pedido_id) references pedidos(id),
  constraint pedido_produtos_produtos foreign key(produto_id) references produtos(id)
);

