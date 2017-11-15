from sqlalchemy import *
from migrate import *


from migrate.changeset import schema
pre_meta = MetaData()
post_meta = MetaData()
transactions = Table('transactions', post_meta,
    Column('id', Integer, primary_key=True, nullable=False),
    Column('user', Integer, nullable=False),
    Column('company', String(length=20), nullable=False),
    Column('quantity', Integer, nullable=False),
    Column('transaction_type', String(length=5), nullable=False),
    Column('stock_type', String(length=10)),
    Column('price', Float, nullable=False),
    Column('transaction_time', DateTime),
)


def upgrade(migrate_engine):
    # Upgrade operations go here. Don't create your own engine; bind
    # migrate_engine to your metadata
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    post_meta.tables['transactions'].columns['stock_type'].create()


def downgrade(migrate_engine):
    # Operations to reverse the above upgrade go here.
    pre_meta.bind = migrate_engine
    post_meta.bind = migrate_engine
    post_meta.tables['transactions'].columns['stock_type'].drop()
