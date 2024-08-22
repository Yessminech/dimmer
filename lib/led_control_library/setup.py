from setuptools import setup, find_packages

setup(
    name='led_control_library',
    version='0.1.0',
    packages=find_packages(),
    install_requires=[
        'pyserial',
    ],
    author='Yessmine Chabchoub',
    author_email='chabchoub.yessmine@gmail.com',
    description='A Python library to control LED brightness using Arduino',
    long_description=open('README.md').read(),
    long_description_content_type='text/markdown',
    url='https://github.com/yessminech/led_control_library',
    classifiers=[
        'Programming Language :: Python :: 3',
        'License :: OSI Approved :: MIT License',
        'Operating System :: OS Independent',
    ],
)
